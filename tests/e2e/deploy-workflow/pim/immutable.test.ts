// @ts-nocheck

import { expect, describe, it, beforeAll } from 'bun:test'

import { isAddress, isHash } from 'viem'

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
} from 'tests/helpers'

describe.skip('#PIM_IMMUTABLE', async () => {
  const { walletClient } = sdk
  const deployer = walletClient.account.address

  const requestedModules = {
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    authorizer: 'AUT_Roles_v1',
    paymentProcessor: 'PP_Simple_v1',
  } as const satisfies RequestedModules<'immutable-pim'>

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
    initialPurchaseAmount: '1000',
  } as const satisfies GetDeployWorkflowArgs<
    typeof requestedModules,
    'immutable-pim'
  >

  let orchestratorAddress: `0x${string}`
  let deployWorkflowReturn: DeployWorkflowReturnType<
    typeof requestedModules,
    'immutable-pim'
  >
  let workflow: Workflow<typeof walletClient, typeof requestedModules>
  let fundingToken: GetModuleReturnType<'ERC20Issuance_v1', PopWalletClient>

  beforeAll(() => {
    fundingToken = sdk.getModule({
      address: args.fundingManager.collateralToken,
      name: 'ERC20Issuance_v1',
      tagConfig: {
        decimals: 18,
      },
    })
  })

  it('1. Set deployWorkflowReturn', async () => {
    deployWorkflowReturn = await sdk.deployWorkflow({
      requestedModules,
      factoryType: 'immutable-pim',
    })
  })

  it('2. Match expected inputs', () => {
    expect(deployWorkflowReturn.inputs).toEqual({
      orchestrator: getDeployWorkflowModuleInputs('OrchestratorFactory_v1'),
      authorizer: getDeployWorkflowModuleInputs('AUT_Roles_v1'),
      fundingManager: getDeployWorkflowModuleInputs(
        'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
        undefined,
        'immutable-pim'
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
    })
  })

  it('3. Mint Collateral For Initial Purchase / Buy From The Curve', async () => {
    const hash = await fundingToken.write.mint.run([deployer, '2000'])

    expect(isHash(hash)).toBeTrue()
  })

  it('4. Estimates gas for deployment', async () => {
    const gasEstimate = await deployWorkflowReturn.estimateGas(args)
    expect(gasEstimate).toContainKeys(['value', 'formatted'])
  })

  it('5. Deploy the workflow', async () => {
    orchestratorAddress = (await deployWorkflowReturn.run(args))
      .orchestratorAddress
    expect(isAddress(orchestratorAddress)).toBeTrue()
  })

  it('6. Set The Workflow', async () => {
    workflow = await sdk.getWorkflow({
      orchestratorAddress,
      requestedModules,
    })

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

    expect(Number(initiallyPurchased)).toBeGreaterThan(0)
  })

  let purchaseReturn: string

  it('8. Buy From The PIM And Match Purchase Return With Balance', async () => {
    purchaseReturn =
      await workflow.fundingManager.read.calculatePurchaseReturn.run(
        args.initialPurchaseAmount
      )

    await workflow.fundingManager.write.buy.run([
      args.initialPurchaseAmount,
      purchaseReturn,
    ])

    const balance =
      await workflow.issuanceToken.module.read.balanceOf.run(deployer)

    const subtracted = Number(balance) - Number(initiallyPurchased)

    expect(subtracted).toBeGreaterThanOrEqual(Number(purchaseReturn))
  })

  it('9. Should sell the bought tokens', async () => {
    const initialBalance =
      await workflow.issuanceToken.module.read.balanceOf.run(deployer)

    const saleReturn =
      await workflow.fundingManager.read.calculateSaleReturn.run(purchaseReturn)

    await workflow.fundingManager.write.sell.run([purchaseReturn, saleReturn])

    const balance =
      await workflow.issuanceToken.module.read.balanceOf.run(deployer)

    expect(Number(balance)).toBeLessThan(Number(initialBalance))
  })
})
