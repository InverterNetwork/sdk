import { getSimulatedWorkflow } from '@/get-simulated-workflow'
import { GET_ORCHESTRATOR_ARGS, TRUSTED_FORWARDER_ADDRESS } from 'tests/helpers'
import { FM_BC_Bancor_VirtualSupply_v1_ARGS } from 'tests/helpers'
import type { RequestedModules } from '@/types'
import { expect, describe, it } from 'bun:test'
import { sdk } from 'tests/helpers'

describe('#SIMULATE_MULTICALL_WORKFLOW', () => {
  const deployer = sdk.walletClient.account.address
  it('should simulate the multicall workflow', async () => {
    const requestedModules = {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Streaming_v1',
    } as const satisfies RequestedModules

    const result = await getSimulatedWorkflow({
      requestedModules,
      args: {
        authorizer: {
          initialAdmin: deployer,
        },
        fundingManager: FM_BC_Bancor_VirtualSupply_v1_ARGS,
        orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
      },
      publicClient: sdk.publicClient,
      walletClient: sdk.walletClient,
      trustedForwarderAddress: TRUSTED_FORWARDER_ADDRESS,
    })

    console.log(result)

    expect(result.orchestratorAddress).toBeDefined()
    expect(result.logicModulesAddresses).toBeDefined()
    expect(result.fundingManagerAddress).toBeDefined()
    expect(result.authorizerAddress).toBeDefined()
    expect(result.paymentProcessorAddress).toBeDefined()
  })
})
