import { expect, describe, it } from 'bun:test'

import { isAddress } from 'viem'

import { type GetDeployReturn, type RequestedModules } from '@'
import { getModuleSchema } from '@/getDeploy/getInputs'

import {
  sdk,
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_ORCHESTRATOR_ARGS,
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
} from 'tests/helpers'

describe.skip('#PIM_IMMUTABLE', async () => {
  const { walletClient } = sdk
  const deployer = walletClient.account.address

  const requestedModules = {
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    authorizer: 'AUT_Roles_v1',
    paymentProcessor: 'PP_Simple_v1',
  } as const satisfies RequestedModules<'restricted-pim'>

  const deployArgs = {
    orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
    authorizer: {
      initialAdmin: deployer,
    },
    fundingManager: FM_BC_Bancor_VirtualSupply_v1_ARGS,
    issuanceToken: {
      name: 'MG Token',
      symbol: 'MGT',
      decimals: 18,
      maxSupply: GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18),
    },
    initialPurchaseAmount: '1000',
  }

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

  it('3. Estimates gas for deployment', async () => {
    const gasEstimate = await getDeployReturn.estimateGas(deployArgs)
    expect(gasEstimate).toContainKeys(['value', 'formatted'])
  })

  it('4. Deploy the workflow', async () => {
    orchestratorAddress = (await getDeployReturn.run(deployArgs))
      .orchestratorAddress
    expect(isAddress(orchestratorAddress)).toBeTrue()
  })
})
