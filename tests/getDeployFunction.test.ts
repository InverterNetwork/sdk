import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from './getTestConnectors'
import { getDeploy } from '../src'

describe('#getDeploy', () => {
  const { walletClient } = getTestConnectors()
  const requestedModules = [
    { name: 'RebasingFundingManager', version: 'v1.0' },
    { name: 'RoleAuthorizer', version: 'v1.0' },
    { name: 'SimplePaymentProcessor', version: 'v1.0' },
  ]

  describe('inputSchema', () => {
    const expectedInputSchema = [
      {
        name: 'Orchestrator',
        version: 'v1.0',
        params: [
          {
            name: 'owner',
            type: 'string',
            description: 'The owner address of the workflow',
            value: '',
          },
          {
            name: 'token',
            type: 'string',
            description: 'The payment token associated with the workflow',
            value: '',
          },
        ],
      },
      {
        name: 'RebasingFundingManager',
        version: 'v1.0',
        params: [
          {
            name: 'orchestratorTokenAddress',
            type: 'address',
            description:
              'The address of the token that will be deposited to the funding manager',
            value: '',
          },
        ],
      },
      {
        name: 'RoleAuthorizer',
        version: 'v1.0',
        params: [
          {
            name: 'initialOwner',
            type: 'address',
            description: 'The initial owner of the workflow',
            value: '',
          },
          {
            name: 'initialManager',
            type: 'address',
            description: 'The initial manager of the workflow',
            value: '',
          },
        ],
      },
      {
        name: 'SimplePaymentProcessor',
        version: 'v1.0',
        params: [],
      },
      [],
    ]

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

      const filledInputSchema = [...inputSchema]
      const [orchestrator, fundingManager, authorizer, paymentProcessor] =
        filledInputSchema
      orchestrator.params[0].value = userInputs.orchestrator.owner
      orchestrator.params[1].value = userInputs.orchestrator.token
      fundingManager.params[0].value =
        userInputs.rebasingFundingManager.orchestratorTokenAddress
      authorizer.params[0].value = userInputs.roleAuthorizer.initialOwner
      authorizer.params[1].value = userInputs.roleAuthorizer.initialManager

      const txHash = await deployFunction(filledInputSchema as any)
      expect(txHash).pass()
    })
  })
})
