import { describe, it, expect } from 'bun:test'

import { WorkflowOrientation } from '../src/types'
import { Inverter } from '../src/Inverter'
import { getTestConnectors } from './testHelpers/getTestConnectors'
import { GetUserArgs, RequestedModules } from '../src'
import { isAddress } from 'viem'

describe('Inverter', () => {
  const { publicClient, walletClient } = getTestConnectors()

  const sdk = new Inverter(publicClient, walletClient)

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
    } satisfies WorkflowOrientation

    describe('#getWorkflow', () => {
      it('adds the workflow to the class instance state', async () => {
        await sdk.getWorkflow(orchestratorAddress, workFlowOrientation)

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
        const workflow = await sdk.getWorkflow(
          orchestratorAddress,
          workFlowOrientation
        )

        expect(workflow).toContainKeys([
          'authorizer',
          'fundingManager',
          'paymentProcessor',
          'erc20Module',
          'orchestrator',
          'optionalModule',
        ])

        describe('#runBountyFunction', () => {
          it('runs one of the read functions of the bounty manager', async () => {
            const result =
              await workflow.optionalModule.LM_PC_Bounties_v1.read.BOUNTY_ISSUER_ROLE.run()

            expect(result).toBeString()
          })
        })
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
