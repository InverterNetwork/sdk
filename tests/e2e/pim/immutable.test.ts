import { expect, describe, it } from 'bun:test'

import { isAddress } from 'viem'

import { type RequestedModules } from '@'
import { getModuleSchema } from '@/getDeploy/getInputs'

import {
  sdk,
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_ORCHESTRATOR_ARGS,
} from 'tests/helpers'

describe.skip('#PIM_IMMUTABLE', async () => {
  const { publicClient, walletClient } = sdk
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
      maxSupply:
        '115792089237316195423570985008687907853269984665640564039457.584007913129639935',
    },
    initialPurchaseAmount: '1000',
  }

  const { estimateGas, run, inputs } = await sdk.getDeploy({
    requestedModules,
    factoryType: 'immutable-pim',
  })

  let orchestrator: `0x${string}`

  it('match expected inputs', () => {
    expect(inputs).toEqual({
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

  it(
    '1. Estimates gas for deployment',
    async () => {
      const gasEstimate = await estimateGas(deployArgs)
      expect(gasEstimate).toContainKeys(['value', 'formatted'])
    },
    {
      timeout: 50_000,
    }
  )

  it(
    'deploys the BC',
    async () => {
      const { orchestratorAddress, transactionHash } = await run(deployArgs)

      await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      })
      // TODO: change after PimFactory has been adapted to only return orchestrator address
      orchestrator = orchestratorAddress

      console.log('Orchestrator Address:', orchestrator)

      expect(isAddress(orchestrator)).toBeTrue()
    },
    {
      timeout: 50_000,
    }
  )
})
