import { describe, expect, it } from 'bun:test'
import { FM_BC_Bancor_VirtualSupply_v1_ARGS, sdk } from 'tests/helpers'
import { zeroAddress } from 'viem'

describe('#ORCHESTRATOR_ADDRESS', () => {
  it('Should simulate 2 different orchestrator deployments and match the addresses', async () => {
    const first = await sdk.deployWorkflow({
      requestedModules: {
        authorizer: 'AUT_Roles_v1',
        fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
        paymentProcessor: 'PP_Simple_v1',
      },
    })
    const second = await sdk.deployWorkflow({
      requestedModules: {
        authorizer: 'AUT_Roles_v1',
        fundingManager: 'FM_DepositVault_v1',
        paymentProcessor: 'PP_Streaming_v1',
      },
    })

    const firstOrchestrator = await first.simulate({
      authorizer: {
        initialAdmin: sdk.walletClient.account.address,
      },
      fundingManager: FM_BC_Bancor_VirtualSupply_v1_ARGS,
    })

    // replace the last digit with 1
    const mockAddress = (zeroAddress.slice(0, -1) + '1') as `0x${string}`

    const secondOrchestrator = await second.simulate({
      authorizer: {
        initialAdmin: mockAddress,
      },
      fundingManager: {
        orchestratorTokenAddress: mockAddress,
      },
    })

    expect(firstOrchestrator.result).toEqual(secondOrchestrator.result)
  })
})
