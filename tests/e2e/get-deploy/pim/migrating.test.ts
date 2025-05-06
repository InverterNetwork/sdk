// @ts-nocheck

import { expect, describe, it, beforeAll } from 'bun:test'

import { isAddress, isHash, parseAbiItem } from 'viem'

import {
  type DeployWorkflowReturnType,
  type GetModuleReturnType,
  type GetDeployWorkflowArgs,
  type PopWalletClient,
  type RequestedModules,
  type Workflow,
} from '@/index'
import { getDeployWorkflowModuleInputs } from '@/deploy-workflow/get-inputs'

import {
  sdk,
  GET_ORCHESTRATOR_ARGS,
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
  CUSTOM_PIM_FM_BC_Bancor_VirtualSupply_v1_ARGS,
  TEST_UNISWAP_V2_ADAPTER_ADDRESS,
  TEST_MIGRATING_PIM_FACTORY_ADDRESS,
} from 'tests/helpers'

describe.skipIf(true || process.env.USE_FORK !== 'true')(
  '#PIM_MIGRATING',
  async () => {
    const { walletClient } = sdk
    const deployer = walletClient.account.address

    const requestedModules = {
      fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
      authorizer: 'AUT_Roles_v1',
      paymentProcessor: 'PP_Simple_v1',
      optionalModules: ['LM_PC_PaymentRouter_v1'],
    } as const satisfies RequestedModules<'migrating-pim'>

    const workflowRequestedModules = {
      ...requestedModules,
      optionalModules: ['LM_PC_Staking_v1', 'LM_PC_PaymentRouter_v1'],
    } as const satisfies RequestedModules<'migrating-pim'>

    const args = {
      orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: CUSTOM_PIM_FM_BC_Bancor_VirtualSupply_v1_ARGS,
      issuanceToken: {
        name: 'MG Token',
        symbol: 'MGT',
        decimals: 18,
        maxSupply: GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18),
      },
      initialPurchaseAmount: '500',
      migrationConfig: {
        dexAdapter: TEST_UNISWAP_V2_ADAPTER_ADDRESS,
        isImmutable: false,
        lpTokenRecipient: deployer,
        migrationThreshold: '1000',
      },
    } as const satisfies GetDeployWorkflowArgs<
      typeof requestedModules,
      'migrating-pim'
    >

    const uniswapFactoryAddress = '0xF62c03E08ada871A0bEb309762E260a7a6a880E6'
    const uniswapRouterAddress = '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3'

    const secondaryPurchaseAmount = '600'
    const initialMintAmount = String(
      Number(args.initialPurchaseAmount) + Number(secondaryPurchaseAmount)
    )

    let orchestratorAddress: `0x${string}`
    let deployWorkflowReturn: DeployWorkflowReturnType<
      typeof requestedModules,
      'migrating-pim'
    >
    let workflow: Workflow<typeof walletClient, typeof workflowRequestedModules>
    let factory: GetModuleReturnType<
      'Migrating_PIM_Factory_v1',
      PopWalletClient
    >
    let fundingToken: GetModuleReturnType<'ERC20Issuance_v1', PopWalletClient>

    let deployerCollateralBalance: string

    beforeAll(() => {
      fundingToken = sdk.getModule({
        address: args.fundingManager.collateralToken,
        name: 'ERC20Issuance_v1',
        tagConfig: {
          decimals: 18,
        },
      })
    })

    it('0. Confirm Uniswap V2 Router is deployed', async () => {
      const addr = '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3'

      const abi = [parseAbiItem('function factory() view returns (address)')]
      const router = await sdk.publicClient.readContract({
        address: addr,
        abi,
        functionName: 'factory',
      })

      expect(isAddress(router)).toBeTrue()
    })

    it('1. Set deployWorkflowReturn', async () => {
      deployWorkflowReturn = await sdk.deployWorkflow({
        requestedModules,
        factoryType: 'migrating-pim',
      })
    })

    it('2. Match expected inputs', () => {
      expect(deployWorkflowReturn.inputs).toEqual({
        orchestrator: getDeployWorkflowModuleInputs('OrchestratorFactory_v1'),
        authorizer: getDeployWorkflowModuleInputs('AUT_Roles_v1'),
        fundingManager: getDeployWorkflowModuleInputs(
          'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
          undefined,
          'migrating-pim'
        ),
        paymentProcessor: getDeployWorkflowModuleInputs('PP_Simple_v1'),
        issuanceToken: getDeployWorkflowModuleInputs(
          'Immutable_PIM_Factory_v1',
          'issuanceToken'
        ),
        initialPurchaseAmount: getDeployWorkflowModuleInputs(
          'Immutable_PIM_Factory_v1',
          'initialPurchaseAmount'
        ),
        migrationConfig: getDeployWorkflowModuleInputs(
          'Migrating_PIM_Factory_v1',
          'migrationConfig'
        ),
        optionalModules: [
          getDeployWorkflowModuleInputs('LM_PC_PaymentRouter_v1'),
        ],
      })
    })

    it('3. Mint Collateral For Initial Purchase / Buy From The Curve', async () => {
      const hash = await fundingToken.write.mint.run([
        deployer,
        initialMintAmount,
      ])

      deployerCollateralBalance =
        await fundingToken.read.balanceOf.run(deployer)
      console.log(
        'deployerCollateralBalance post initial mint',
        deployerCollateralBalance
      )

      expect(isHash(hash)).toBeTrue()
    })

    it('4. Estimates gas for deployment', async () => {
      const gasEstimate = await deployWorkflowReturn.estimateGas(args)
      expect(gasEstimate).toContainKeys(['value', 'formatted'])
    })

    it('5. Deploy the uniswap v2 adapter', async () => {
      const { contractAddress } = await sdk.deploy({
        name: 'UniswapV2Adapter',
        args: {
          factoryAddress: uniswapFactoryAddress,
          routerAddress: uniswapRouterAddress,
        },
      })

      // @ts-expect-error - This is a test
      args.migrationConfig.dexAdapter = contractAddress

      expect(isAddress(contractAddress ?? '')).toBeTrue()
    })

    it('5.1. Deploy the workflow', async () => {
      orchestratorAddress = (await deployWorkflowReturn.run(args))
        .orchestratorAddress
      expect(isAddress(orchestratorAddress)).toBeTrue()
    })

    it('6. Set The Workflow', async () => {
      workflow = await sdk.getWorkflow({
        orchestratorAddress,
        requestedModules: {
          ...requestedModules,
          optionalModules: ['LM_PC_Staking_v1', 'LM_PC_PaymentRouter_v1'],
        },
      })

      factory = sdk.getModule({
        address: TEST_MIGRATING_PIM_FACTORY_ADDRESS,
        name: 'Migrating_PIM_Factory_v1',
        tagConfig: {
          decimals: 18,
          issuanceTokenDecimals: workflow.issuanceToken.decimals,
          issuanceToken: workflow.issuanceToken.address,
          defaultToken: args.fundingManager.collateralToken,
        },
      })

      const admin = await factory.read.admin.run()
      expect(admin).toBe(deployer)

      expect(workflow).toContainKeys([
        'orchestrator',
        'authorizer',
        'fundingManager',
        'paymentProcessor',
        'fundingToken',
        'issuanceToken',
      ])
    })

    let initiallyPurchased: string

    it('7. Should Confirm The Initial Purchase Happened', async () => {
      initiallyPurchased =
        await workflow.issuanceToken.module.read.balanceOf.run(deployer)

      deployerCollateralBalance =
        await fundingToken.read.balanceOf.run(deployer)
      console.log(
        'deployerCollateralBalance post initial purchase balance',
        deployerCollateralBalance
      )

      expect(Number(deployerCollateralBalance)).toBeCloseTo(
        Number(initialMintAmount) - Number(args.initialPurchaseAmount),
        -2
      )
      expect(Number(initiallyPurchased)).toBeGreaterThan(0)
    })

    let purchaseReturn: string

    it('8. Buy From The PIM And trigger migration with secondary purchase', async () => {
      purchaseReturn =
        await workflow.fundingManager.read.calculatePurchaseReturn.run(
          secondaryPurchaseAmount
        )

      await factory.write.buyFor.run([
        workflow.fundingManager.address,
        deployer,
        secondaryPurchaseAmount,
        purchaseReturn,
      ])

      deployerCollateralBalance =
        await fundingToken.read.balanceOf.run(deployer)
      console.log(
        'deployerCollateralBalance post secondary purchase balance',
        deployerCollateralBalance
      )

      const refundAmount =
        Number(initialMintAmount) -
        Number(args.migrationConfig.migrationThreshold)

      expect(Number(deployerCollateralBalance)).toBeCloseTo(refundAmount, -2)
    })

    it('9. Should check if the migration threshold is reached', async () => {
      const isMigrated = await factory.read.getIsGraduated.run(
        workflow.fundingManager.address
      )

      expect(isMigrated).toBeTrue()
    })

    it('10. Should check if the staking module has only fees left in it', async () => {
      const collateralBalance = await fundingToken.read.balanceOf.run(
        workflow.optionalModule.LM_PC_Staking_v1.address
      )

      const collectedFees = Number(
        await workflow.fundingManager.read.projectCollateralFeeCollected.run()
      )

      const threshold = Number(args.migrationConfig.migrationThreshold)

      expect(Number(collateralBalance)).toBeCloseTo(
        threshold - (threshold - collectedFees),
        -2
      )
    })
  }
)
