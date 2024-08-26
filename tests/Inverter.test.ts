import { describe, it, expect } from 'bun:test'

import { Inverter } from '../src/Inverter'
import { getTestConnectors } from './testHelpers/getTestConnectors'
import type {
  GetUserArgs,
  RequestedModules,
  WorkflowRequestedModules,
} from '../src'
import { isAddress } from 'viem'

describe('Inverter', () => {
  const { publicClient, walletClient } = getTestConnectors()

  const sdk = new Inverter({ publicClient, walletClient })

  describe('#constructor', () => {
    it('instantiates the sdk with public and wallet client', async () => {
      expect(sdk.publicClient.type).toEqual('publicClient')
      expect(sdk.walletClient.type).toEqual('walletClient')
    })
  })

  describe('operations', () => {
    const orchestratorAddress = '0xBc986B80A3c6b274CEd09db5A3b0Ac76a4046968'
    const requestedModules = {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Streaming_v1',
      optionalModules: ['LM_PC_PaymentRouter_v1'],
    } as const satisfies WorkflowRequestedModules

    describe('#getWorkflow', () => {
      it('adds the workflow to the class instance state', async () => {
        await sdk.getWorkflow({ orchestratorAddress, requestedModules })

        expect(await sdk.workflows.get(orchestratorAddress)).toContainKeys([
          'authorizer',
          'fundingManager',
          'paymentProcessor',
          'fundingToken',
          'issuanceToken',
          'orchestrator',
          'optionalModule',
        ])
      })

      it('gets the workflow', async () => {
        const workflow = await sdk.getWorkflow({
          orchestratorAddress,
          requestedModules,
        })

        expect(workflow).toContainKeys([
          'authorizer',
          'fundingManager',
          'paymentProcessor',
          'fundingToken',
          'issuanceToken',
          'orchestrator',
          'optionalModule',
        ])

        describe('#runBountyFunction', () => {
          it('runs one of the read functions of the bounty manager', async () => {
            const result =
              await workflow.optionalModule.LM_PC_PaymentRouter_v1.read.title.run()

            expect(result).toBeString()
          })
        })
      })
    })
  })

  describe('#getDeploy', () => {
    const requestedModules = {
      fundingManager: 'FM_DepositVault_v1',
      paymentProcessor: 'PP_Simple_v1',
      authorizer: 'AUT_TokenGated_Roles_v1',
    } satisfies RequestedModules

    const args: GetUserArgs<{
      fundingManager: 'FM_DepositVault_v1'
      authorizer: 'AUT_TokenGated_Roles_v1'
      paymentProcessor: 'PP_Simple_v1'
    }> = {
      orchestrator: {
        independentUpdates: true,
        independentUpdateAdmin: '0x86fda565A5E96f4232f8136141C92Fd79F2BE950',
      },
      fundingManager: {
        orchestratorTokenAddress: '0x6ce9fe09c5fa9c43fd0206f4c33a03cb11d1a179',
      },
      authorizer: {
        initialAdmin: '0x86fda565A5E96f4232f8136141C92Fd79F2BE950',
      },
    }

    describe('#simulate', () => {
      it('simulates the deployment tx', async () => {
        const { simulate } = await sdk.getDeploy({ requestedModules })
        const { result } = await simulate(args)
        expect(isAddress(result)).toBeTrue
      })
    })
  })
})
