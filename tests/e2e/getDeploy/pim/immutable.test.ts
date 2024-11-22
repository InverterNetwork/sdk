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
import { getModuleSchema } from '@/getDeploy/getInputs'

import {
  sdk,
  GET_ORCHESTRATOR_ARGS,
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
  CUSTOM_PIM_FM_BC_Bancor_VirtualSupply_v1_ARGS,
  TEST_IMMUTABLE_PIM_FACTORY_ADDRESS,
} from 'tests/helpers'

describe('#PIM_IMMUTABLE', async () => {
  const { walletClient } = sdk
  const deployer = walletClient.account.address

  const requestedModules = {
    fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
    authorizer: 'AUT_Roles_v1',
    paymentProcessor: 'PP_Simple_v1',
    optionalModules: ['LM_PC_PaymentRouter_v1'],
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
    isImmutable: false,
  } as const satisfies GetUserArgs<typeof requestedModules, 'immutable-pim'>

  let orchestratorAddress: `0x${string}`
  let getDeployReturn: GetDeployReturn<typeof requestedModules, 'immutable-pim'>
  let workflow: Workflow<typeof walletClient, typeof requestedModules>
  let factory: GetModuleReturn<'Immutable_PIM_Factory_v1', PopWalletClient>
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
      factoryType: 'immutable-pim',
    })
  })

  it('2. Match expected inputs', () => {
    expect(getDeployReturn.inputs).toEqual({
      orchestrator: getModuleSchema('OrchestratorFactory_v1'),
      authorizer: getModuleSchema('AUT_Roles_v1'),
      fundingManager: getModuleSchema(
        'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
        undefined,
        'immutable-pim'
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
      optionalModules: [getModuleSchema('LM_PC_PaymentRouter_v1')],
      isImmutable: getModuleSchema('Immutable_PIM_Factory_v1', 'isImmutable'),
    })
  })

  it('3. Mint Collateral For Initial Purchase / Buy From The Curve', async () => {
    // 3. Mint test tokens to deployer
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

  it('8: Should set the factory module', () => {
    factory = sdk.getModule({
      address: TEST_IMMUTABLE_PIM_FACTORY_ADDRESS,
      name: 'Immutable_PIM_Factory_v1',
      extras: {
        issuanceTokenDecimals: 18,
        decimals: 18,
        defaultToken: args.fundingManager.collateralToken,
        issuanceToken: workflow.issuanceToken.address,
      },
    })
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
      '1000',
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

    await factory.write.sellTo.run([
      workflow.issuanceToken.address,
      deployer,
      purchaseReturn,
      saleReturn,
    ])

    const balance =
      await workflow.issuanceToken.module.read.balanceOf.run(deployer)

    expect(Number(balance)).toBeLessThan(Number(initialBalance))
  })
})
