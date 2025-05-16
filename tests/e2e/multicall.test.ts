import { expect, describe, it } from 'bun:test'
import type { Workflow } from '@/index'
import type {
  GetDeployWorkflowArgs,
  Multicall,
  RequestedModules,
  SingleCall,
} from '@/types'
import {
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_ORCHESTRATOR_ARGS,
  sdk,
} from 'tests/helpers'
import { multicall } from '@/multicall'

describe('#MULTICALL', () => {
  const deployer = sdk.walletClient.account.address

  describe('#BONDING_CURVE', () => {
    const requestedModules = {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Streaming_v1',
    } as const satisfies RequestedModules

    const args = {
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: FM_BC_Bancor_VirtualSupply_v1_ARGS,
      orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
    } as const satisfies GetDeployWorkflowArgs<typeof requestedModules>

    let orchestratorAddress: `0x${string}`
    let workflow: Workflow<typeof requestedModules, typeof sdk.walletClient>

    it('1. Should Deploy The Workflow', async () => {
      orchestratorAddress = (
        await (
          await sdk.deployWorkflow({
            requestedModules,
          })
        ).run(args)
      ).orchestratorAddress

      expect(orchestratorAddress).toContain('0x')
    })
    it('2. Should Get The Workflow', async () => {
      workflow = await sdk.getWorkflow({
        orchestratorAddress: orchestratorAddress,
        requestedModules,
      })
      expect(workflow).toBeObject()
    })
    it('3. Should open buy and sell using multicall', async () => {
      const openBuySingleCall: SingleCall = {
        address: workflow.fundingManager.address,
        allowFailure: false, // Allow failures in case of authorization issues
        callData: await workflow.fundingManager.bytecode.openBuy.run(),
      }

      const openSellSingleCall: SingleCall = {
        address: workflow.fundingManager.address,
        allowFailure: false, // Allow failures in case of authorization issues
        callData: await workflow.fundingManager.bytecode.openSell.run(),
      }

      const call: Multicall = [openBuySingleCall, openSellSingleCall]

      const transactionHash = await multicall({
        call,
        publicClient: sdk.publicClient,
        walletClient: sdk.walletClient,
        orchestratorAddress,
      })

      console.log('Transaction hash:', transactionHash)
      expect(transactionHash).toBeString()
    })
  })
})
