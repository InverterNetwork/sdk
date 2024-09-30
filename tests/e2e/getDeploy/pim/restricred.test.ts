import { expect, describe, it } from 'bun:test'

import {
  CUSTOM_PIM_FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
  GET_ORCHESTRATOR_ARGS,
  TEST_ERC20_MOCK_ADDRESS,
  TEST_RESTRICTED_PIM_FACTORY_ADDRESS,
  sdk,
} from 'tests/helpers'
import {
  ERC20_MINTABLE_ABI,
  type RequestedModules,
  type GetUserArgs,
  type GetDeployReturn,
  type Workflow,
} from '@'
import {
  parseUnits,
  getContract,
  type GetContractReturnType,
  isHash,
  isAddress,
} from 'viem'
import { getModuleSchema } from '@/getDeploy/getInputs'
import { getModuleData, type GetModuleData } from '@inverter-network/abis'

describe('#PIM_RESTRICTED', async () => {
  const { walletClient } = sdk
  const deployer = walletClient.account.address

  const requestedModules = {
    fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
    authorizer: 'AUT_Roles_v1',
    paymentProcessor: 'PP_Simple_v1',
  } as const satisfies RequestedModules<'restricted-pim'>

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
  } as const satisfies GetUserArgs<typeof requestedModules, 'restricted-pim'>

  // ================PRE_DETERMINED VARIABLES================
  let orchestratorAddress: `0x${string}`
  let getDeployReturn: GetDeployReturn<
    typeof requestedModules,
    'restricted-pim'
  >
  let amount: bigint
  let tokenInstance: GetContractReturnType<
    typeof ERC20_MINTABLE_ABI,
    {
      wallet: typeof walletClient
    }
  >
  let factoryInstance: GetContractReturnType<
    GetModuleData<'Restricted_PIM_Factory_v1'>['abi'],
    { wallet: typeof walletClient }
  >
  let workflow: Workflow<typeof walletClient, typeof requestedModules>
  // ========================================================

  it('1. Set getDeployReturn', async () => {
    getDeployReturn = await sdk.getDeploy({
      requestedModules,
      factoryType: 'restricted-pim',
    })

    expect(getDeployReturn).toContainKeys(['estimateGas', 'run', 'inputs'])
  })

  it('2. Mint test tokens to deployer', async () => {
    // 1. Define the amount to be minted
    amount = parseUnits(
      args.fundingManager.bondingCurveParams.initialCollateralSupply,
      args.issuanceToken.decimals
    )

    // 2. Create a token contract instance
    tokenInstance = getContract({
      address: TEST_ERC20_MOCK_ADDRESS,
      client: walletClient,
      abi: ERC20_MINTABLE_ABI,
    })

    // 3. Mint test tokens to deployer
    const hash = await tokenInstance.write.mint([deployer, amount])

    expect(isHash(hash)).toBeTrue()
  })

  it('3. Approving test tokens to factory', async () => {
    const hash = await tokenInstance.write.approve([
      TEST_RESTRICTED_PIM_FACTORY_ADDRESS,
      amount,
    ])
    expect(isHash(hash)).toBeTrue()
  })

  it('4. Add Funding To Facory', async () => {
    factoryInstance = getContract({
      address: TEST_RESTRICTED_PIM_FACTORY_ADDRESS,
      client: walletClient,
      abi: getModuleData('Restricted_PIM_Factory_v1').abi,
    })

    // add funding to factory
    const hash = await factoryInstance.write.addFunding([
      deployer,
      TEST_ERC20_MOCK_ADDRESS,
      amount,
    ])

    expect(isHash(hash)).toBeTrue()
  })

  it('5. Match expected inputs', () => {
    expect(getDeployReturn.inputs).toEqual({
      orchestrator: getModuleSchema('OrchestratorFactory_v1'),
      authorizer: getModuleSchema('AUT_Roles_v1'),
      fundingManager: getModuleSchema(
        'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1'
      ),
      paymentProcessor: getModuleSchema('PP_Simple_v1'),
      issuanceToken: getModuleSchema(
        'Restricted_PIM_Factory_v1',
        'issuanceToken'
      ),
    })
  })

  it('6. Estimates gas for deployment', async () => {
    const gasEstimate = await getDeployReturn.estimateGas(args)
    expect(gasEstimate).toContainKeys(['value', 'formatted'])
  })

  it('7. Deploy the workflow', async () => {
    orchestratorAddress = (await getDeployReturn.run(args)).orchestratorAddress
    expect(isAddress(orchestratorAddress)).toBeTrue()
  })

  it('8. Get and set Workflow', async () => {
    workflow = await sdk.getWorkflow({
      orchestratorAddress,
      requestedModules,
    })

    expect(workflow).toContainKeys([
      'fundingManager',
      'authorizer',
      'paymentProcessor',
    ])
  })

  it('9. Mint & Open Buy & Buy', async () => {
    const depositAmount = '500'

    // Mint Funding Tokens
    await tokenInstance.write.mint([deployer, parseUnits(depositAmount, 18)])

    // Approve Funding Tokens
    await tokenInstance.write.approve([
      workflow.fundingManager.address,
      parseUnits(depositAmount, 18),
    ])

    // Open Buy
    await workflow.fundingManager.write.openBuy.run()

    // Get expected amount out
    const amountOut =
      await workflow.fundingManager.read.calculatePurchaseReturn.run(
        depositAmount
      )

    // Buy
    const hash = await workflow.fundingManager.write.buy.run([
      depositAmount,
      amountOut,
    ])

    expect(isHash(hash)).toBeTrue()
  })
})
