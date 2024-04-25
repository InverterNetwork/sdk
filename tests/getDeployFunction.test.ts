import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from './getTestConnectors'
import { getDeploy } from '../src'

describe.only('#getDeploy', () => {
  const { walletClient } = getTestConnectors()
  const requestedModules = [
    { name: 'RebasingFundingManager', version: 'v1.0' },
    { name: 'RoleAuthorizer', version: 'v1.0' },
    { name: 'SimplePaymentProcessor', version: 'v1.0' },
  ]

  describe('inputSchema', () => {
    const expectedInputSchema = {
      orchestrator: {
        name: 'Orchestrator',
        version: 'v1.0',
        params: [
          {
            name: 'owner',
            type: 'address',
            jsType: '',
            description: 'The owner address of the workflow',
          },
          {
            name: 'token',
            type: 'address',
            jsType: '',
            description: 'The payment token associated with the workflow',
          },
        ],
      },
      fundingManager: {
        name: 'RebasingFundingManager',
        version: 'v1.0',
        params: [
          {
            name: 'orchestratorTokenAddress',
            type: 'address',
            jsType: '',
            description:
              'The address of the token that will be deposited to the funding manager',
          },
        ],
      },
      authorizer: {
        name: 'RoleAuthorizer',
        version: 'v1.0',
        params: [
          {
            name: 'initialOwner',
            type: 'address',
            jsType: '',
            description: 'The initial owner of the workflow',
          },
          {
            name: 'initialManager',
            type: 'address',
            jsType: '',
            description: 'The initial manager of the workflow',
          },
        ],
      },
      paymentProcessor: {
        name: 'SimplePaymentProcessor',
        version: 'v1.0',
        params: [],
      },
      logicModules: [],
    }

    it('has the correct format', async () => {
      const { inputSchema } = await getDeploy(
        walletClient,
        requestedModules as any
      )
      expect(inputSchema).toEqual(expectedInputSchema)
    })
  })

  describe('deploymentFunction', () => {
    const userInputs = {
      orchestrator: {
        token: '0x5eb14c2e7D0cD925327d74ae4ce3fC692ff8ABEF',
        owner: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
      },
      rebasingFundingManager: {
        orchestratorTokenAddress: '0x5eb14c2e7D0cD925327d74ae4ce3fC692ff8ABEF',
      },
      roleAuthorizer: {
        initialOwner: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
        initialManager: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
      },
    }

    it('submits a tx', async () => {
      const { inputSchema, deployFunction } = await getDeploy(
        walletClient,
        requestedModules as any
      )

      const args = { ...inputSchema }
      args.orchestrator = {
        params: [userInputs.orchestrator.owner, userInputs.orchestrator.token],
      }
      args.fundingManager = {
        params: [userInputs.rebasingFundingManager.orchestratorTokenAddress],
      }
      args.authorizer = {
        params: [
          userInputs.roleAuthorizer.initialOwner,
          userInputs.roleAuthorizer.initialManager,
        ],
      }
      args.paymentProcessor = {
        params: [],
      }

      const txHash = deployFunction(args as any)
      expect(txHash).pass()
    })
  })
})
