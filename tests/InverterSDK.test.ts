import { describe, it, beforeEach, expect } from 'bun:test'

import { WorkflowOrientation } from '../src/getWorkflow/types'
import { InverterSDK } from '../src/inverterSdk'
import { getTestConnectors } from './getTestConnectors'
import { GetUserArgs, RequestedModules } from '../src'
import { isAddress } from 'viem'

interface MyWorkflowOrientation extends WorkflowOrientation {
  authorizer: 'AUT_Roles_v1'
  fundingManager: 'FM_Rebasing_v1'
  paymentProcessor: 'PP_Simple_v1'
  optionalModules: ['LM_PC_Bounties_v1']
}

describe('InverterSDK', () => {
  const { publicClient, walletClient } = getTestConnectors()

  let sdk: InverterSDK

  beforeEach(async () => {
    sdk = new InverterSDK(publicClient, walletClient)
  })

  describe('#constructor', () => {
    it('instantiates the sdk with public and wallet client', async () => {
      expect(sdk.publicClient.type).toEqual('publicClient')
      expect(sdk.walletClient.type).toEqual('walletClient')
    })
  })

  describe('operations', () => {
    const orchestratorAddress = '0x614aFB457ad58f15ED7b32615417c628e30C0c65'
    const workFlowOrientation = {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_Rebasing_v1',
      paymentProcessor: 'PP_Simple_v1',
      optionalModules: ['LM_PC_Bounties_v1'],
    } as MyWorkflowOrientation

    describe('#getWorkflow', () => {
      beforeEach(async () => {
        await sdk.getWorkflow(orchestratorAddress, workFlowOrientation)
      })

      it('adds the workflow to the class instance state', async () => {
        expect(await sdk.workflows.get(orchestratorAddress)).toContainKeys([
          'authorizer',
          'fundingManager',
          'paymentProcessor',
          'erc20Module',
          'orchestrator',
          'optionalModule',
        ])
      })

      it('gets the workflow', async () => {
        const workflow = await sdk.getWorkflow(orchestratorAddress)

        expect(workflow).toContainKeys([
          'authorizer',
          'fundingManager',
          'paymentProcessor',
          'erc20Module',
          'orchestrator',
          'optionalModule',
        ])
      })
    })
  })

  describe('#getDeploy', () => {
    const requestedModules = {
      fundingManager: 'FM_Rebasing_v1',
      paymentProcessor: 'PP_Simple_v1',
      authorizer: 'AUT_TokenGated_Roles_v1',
    } satisfies RequestedModules

    const args: GetUserArgs<{
      fundingManager: 'FM_Rebasing_v1'
      authorizer: 'AUT_TokenGated_Roles_v1'
      paymentProcessor: 'PP_Simple_v1'
    }> = {
      orchestrator: {
        owner: '0x86fda565A5E96f4232f8136141C92Fd79F2BE950',
        token: '0x86fda565A5E96f4232f8136141C92Fd79F2BE950',
      },
      fundingManager: {
        orchestratorTokenAddress: '0x5eb14c2e7D0cD925327d74ae4ce3fC692ff8ABEF',
      },
      authorizer: {
        initialOwner: '0x86fda565A5E96f4232f8136141C92Fd79F2BE950',
        initialManager: '0x86fda565A5E96f4232f8136141C92Fd79F2BE950',
      },
    }

    describe('#simulate', () => {
      it('simulates the deployment tx', async () => {
        const { simulate } = await sdk.getDeploy(requestedModules)
        const { result } = await simulate(args as any)
        expect(isAddress(result)).toBeTrue
      })
    })
  })
})
