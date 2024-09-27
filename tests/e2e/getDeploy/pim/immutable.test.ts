import { expect, describe, it } from 'bun:test'

import { getContract, isAddress, isHash, parseUnits } from 'viem'

import {
  ERC20_MINTABLE_ABI,
  type GetDeployReturn,
  type GetUserArgs,
  type RequestedModules,
} from '@'
import { getModuleSchema } from '@/getDeploy/getInputs'

import {
  sdk,
  GET_ORCHESTRATOR_ARGS,
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
  TEST_ERC20_MOCK_ADDRESS,
  CUSTOM_PIM_FM_BC_Bancor_VirtualSupply_v1_ARGS,
} from 'tests/helpers'

describe('#PIM_IMMUTABLE', async () => {
  const { walletClient } = sdk
  const deployer = walletClient.account.address

  const requestedModules = {
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
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
    initialPurchaseAmount: '1000',
  } as const satisfies GetUserArgs<typeof requestedModules, 'immutable-pim'>

  let orchestratorAddress: `0x${string}`
  let getDeployReturn: GetDeployReturn<typeof requestedModules, 'immutable-pim'>

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
        'FM_BC_Bancor_Redeeming_VirtualSupply_v1'
      ),
      paymentProcessor: getModuleSchema('PP_Simple_v1'),
      issuanceToken: getModuleSchema(
        'Restricted_PIM_Factory_v1',
        'issuanceToken'
      ),
      initialPurchaseAmount: getModuleSchema(
        'Immutable_PIM_Factory_v1',
        'initialPurchaseAmount'
      ),
    })
  })

  it('3. Mint Collateral For Initial Purchase', async () => {
    // 1. Define the amount to be minted
    const amount = parseUnits(
      args.initialPurchaseAmount,
      args.issuanceToken.decimals
    )

    // 2. Create a token contract instance
    const tokenInstance = getContract({
      address: TEST_ERC20_MOCK_ADDRESS,
      client: walletClient,
      abi: ERC20_MINTABLE_ABI,
    })

    // 3. Mint test tokens to deployer
    const hash = await tokenInstance.write.mint([deployer, amount])

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
})
