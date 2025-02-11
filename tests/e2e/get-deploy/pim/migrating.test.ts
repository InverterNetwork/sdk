import { expect, describe, it, beforeAll } from 'bun:test'

import { isAddress, isHash } from 'viem'

import {
  type GetDeployReturn,
  type GetModuleReturn,
  type GetUserArgs,
  type PopWalletClient,
  type RequestedModules,
  type Workflow,
} from '@'
import { getModuleSchema } from '@/get-deploy/get-inputs'

import {
  sdk,
  GET_ORCHESTRATOR_ARGS,
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
  CUSTOM_PIM_FM_BC_Bancor_VirtualSupply_v1_ARGS,
  TEST_UNISWAP_V2_ADAPTER_ADDRESS,
  TEST_MIGRATING_PIM_FACTORY_ADDRESS,
} from 'tests/helpers'

describe('#PIM_IMMUTABLE', async () => {
  const { walletClient } = sdk
  const deployer = walletClient.account.address

  const requestedModules = {
    fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
    authorizer: 'AUT_Roles_v1',
    paymentProcessor: 'PP_Simple_v1',
    optionalModules: ['LM_PC_PaymentRouter_v1'],
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
  } as const satisfies GetUserArgs<typeof requestedModules, 'migrating-pim'>

  let orchestratorAddress: `0x${string}`
  let getDeployReturn: GetDeployReturn<typeof requestedModules, 'migrating-pim'>
  let workflow: Workflow<typeof walletClient, typeof requestedModules>
  let factory: GetModuleReturn<'Migrating_PIM_Factory_v1', PopWalletClient>
  let fundingToken: GetModuleReturn<'ERC20Issuance_v1', PopWalletClient>

  beforeAll(() => {
    fundingToken = sdk.getModule({
      address: args.fundingManager.collateralToken,
      name: 'ERC20Issuance_v1',
      extras: {
        decimals: 18,
      },
    })
  })

  it('1. Set getDeployReturn', async () => {
    getDeployReturn = await sdk.getDeploy({
      requestedModules,
      factoryType: 'migrating-pim',
    })
  })

  it('2. Match expected inputs', () => {
    expect(getDeployReturn.inputs).toEqual({
      orchestrator: getModuleSchema('OrchestratorFactory_v1'),
      authorizer: getModuleSchema('AUT_Roles_v1'),
      fundingManager: getModuleSchema(
        'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
        undefined,
        'migrating-pim'
      ),
      paymentProcessor: getModuleSchema('PP_Simple_v1'),
      issuanceToken: getModuleSchema(
        'Immutable_PIM_Factory_v1',
        'issuanceToken'
      ),
      initialPurchaseAmount: getModuleSchema(
        'Immutable_PIM_Factory_v1',
        'initialPurchaseAmount'
      ),
      migrationConfig: getModuleSchema(
        'Migrating_PIM_Factory_v1',
        'migrationConfig'
      ),
      optionalModules: [getModuleSchema('LM_PC_PaymentRouter_v1')],
    })
  })

  it('3. Mint Collateral For Initial Purchase / Buy From The Curve', async () => {
    const hash = await fundingToken.write.mint.run([deployer, '2000'])

    expect(isHash(hash)).toBeTrue()
  })

  it('4. Estimates gas for deployment', async () => {
    const gasEstimate = await getDeployReturn.estimateGas(args)
    expect(gasEstimate).toContainKeys(['value', 'formatted'])
  })

  it('5. Deploy the workflow', async () => {
    orchestratorAddress = (await getDeployReturn.run(args)).orchestratorAddress
    expect(isAddress(orchestratorAddress)).toBeTrue()
  })

  it('6. Set The Workflow', async () => {
    workflow = await sdk.getWorkflow({
      orchestratorAddress,
      requestedModules,
    })

    factory = sdk.getModule({
      address: TEST_MIGRATING_PIM_FACTORY_ADDRESS,
      name: 'Migrating_PIM_Factory_v1',
      extras: {
        decimals: 18,
        issuanceToken: workflow.issuanceToken.address,
        defaultToken: args.fundingManager.collateralToken,
      },
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

    await factory.write.buyForUpTo.run([
      workflow.issuanceToken.address,
      deployer,
      '500',
      purchaseReturn,
    ])

    const balance =
      await workflow.issuanceToken.module.read.balanceOf.run(deployer)

    const subtracted = Number(balance) - Number(initiallyPurchased)

    expect(subtracted).toBeGreaterThanOrEqual(Number(purchaseReturn))
  })

  it('9. Should check if the migration threshold is reached', async () => {
    const isMigrated = await factory.read.isGraduated.run()

    expect(isMigrated).toBeTrue()
  })
})
