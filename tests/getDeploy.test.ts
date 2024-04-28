import { expect, describe, it, beforeEach } from 'bun:test'

import { getTestConnectors } from './getTestConnectors'
import { getDeploy } from '../src'

describe('#getDeploy', () => {
  const { walletClient } = getTestConnectors()

  describe('Modules: RebasingFundingManager, RoleAuthorizer, SimplePaymentProcessor', () => {
    const requestedModules = [
      { name: 'RebasingFundingManager', version: 'v1.0' },
      { name: 'RoleAuthorizer', version: 'v1.0' },
      { name: 'SimplePaymentProcessor', version: 'v1.0' },
    ]

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

    const expectedBaseInputSchema = {
      Orchestrator: {
        version: 'v1.0',
        params: {
          owner: {
            type: 'address',
            jsType: 'string',
            description: 'The owner address of the workflow',
          },
          token: {
            type: 'address',
            jsType: 'string',
            description: 'The payment token associated with the workflow',
          },
        },
      },
      RebasingFundingManager: {
        version: 'v1.0',
        params: {
          orchestratorTokenAddress: {
            type: 'address',
            jsType: 'string',
            description:
              'The address of the token that will be deposited to the funding manager',
          },
        },
      },
      RoleAuthorizer: {
        version: 'v1.0',
        params: {
          initialOwner: {
            type: 'address',
            jsType: 'string',
            description: 'The initial owner of the workflow',
          },
          initialManager: {
            type: 'address',
            jsType: 'string',
            description: 'The initial manager of the workflow',
          },
        },
      },
    }

    let args: any

    beforeEach(async () => {
      const { inputSchema } = await getDeploy(
        walletClient,
        requestedModules as any
      )
      args = { ...inputSchema }
      args.Orchestrator = {
        owner: userInputs.orchestrator.owner,
        token: userInputs.orchestrator.token,
      }
      args.RebasingFundingManager = {
        orchestratorTokenAddress:
          userInputs.rebasingFundingManager.orchestratorTokenAddress,
      }
      args.RoleAuthorizer = {
        initialOwner: userInputs.roleAuthorizer.initialOwner,
        initialManager: userInputs.roleAuthorizer.initialManager,
      }
    })

    describe('optionalModules: none', () => {
      describe('inputSchema', () => {
        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(
            walletClient,
            requestedModules as any
          )
          expect(inputSchema).toEqual(expectedBaseInputSchema)
        })
      })

      describe('deploymentFunction', () => {
        it('submits a tx', async () => {
          const { deployFunction } = await getDeploy(
            walletClient,
            requestedModules as any
          )
          const txHash = await deployFunction(args as any)
          expect(txHash.length).toEqual(66)
        })
      })
    })

    describe('optionalModules: MetadataManager', () => {
      describe('inputSchema', () => {
        const expectedMetadataManagerSchema = {
          version: 'v1.0',
          params: {
            managerName: {
              type: 'string',
              description: 'The (user-) name of the manager',
              jsType: 'string',
            },
            managerAccount: {
              type: 'address',
              description: 'The address of the manager',
              jsType: 'string',
            },
            managerTwitterHandle: {
              type: 'string',
              description: 'The twitter handle of the manager',
              jsType: 'string',
            },
            title: {
              type: 'string',
              description: 'The name of the workflow/orchestrator',
              jsType: 'string',
            },
            descriptionShort: {
              type: 'string',
              description: 'The short description of the workflow/orchestrator',
              jsType: 'string',
            },
            descriptionLong: {
              type: 'string',
              description: 'The long description of the workflow/orchestrator',
              jsType: 'string',
            },
            externalMedias: {
              type: 'string[]',
              description: 'An array of links to external medias',
              jsType: undefined,
            },
            categories: {
              type: 'string[]',
              description: 'An array of categories of the workflow/orchestator',
              jsType: undefined,
            },
            memberName: {
              type: 'string',
              description: 'The (user-) name of the member',
              jsType: 'string',
            },
            memberAccount: {
              type: 'address',
              description: 'The address of the member',
              jsType: 'string',
            },
            memberUrl: {
              type: 'string',
              description: 'A url of the member',
              jsType: 'string',
            },
          },
        }

        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'MetadataManager', version: 'v1.0' },
          ] as any)
          expect(inputSchema).toEqual({
            ...expectedBaseInputSchema,
            MetadataManager: expectedMetadataManagerSchema,
          })
        })
      })

      describe.skip('deployFunction', () => {
        it('submits a tx', async () => {
          const { deployFunction } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'MetadataManager', version: 'v1.0' },
          ] as any)
          const argsCopy = { ...args }
          argsCopy.MetadataManager = {
            managerName: 'example manager name',
            managerAccount: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
            managerTwitterHandle: '@twitter_handle',
            title: 'example workflow name',
            descriptionShort: 'example short description',
            descriptionLong: 'example long description',
            externalMedias: [
              'example external media 1',
              'example external media 2',
            ],
            categories: ['example category 1', 'example category 2'],
            memberName: 'example member name',
            memberAccount: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
            memberUrl: 'example member url',
          }
          const txHash = await deployFunction(argsCopy as any)
          expect(txHash.length).toEqual(66)
        })
      })
    })

    describe('optional: BountyManager', () => {
      describe('inputSchema', () => {
        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'BountyManager', version: 'v1.0' },
          ] as any)

          expect(inputSchema).toEqual({
            ...expectedBaseInputSchema,
          })
        })
      })

      describe('deployFunction', () => {
        it('has the correct format', async () => {
          const { deployFunction } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'BountyManager', version: 'v1.0' },
          ] as any)
          const argsCopy = { ...args }
          const txHash = await deployFunction(argsCopy as any)
          expect(txHash.length).toEqual(66)
        })
      })
    })

    describe('optional: RecurringPaymentManager', () => {
      const expectedSchema = {
        version: 'v1.0',
        params: {
          epochLength: {
            description:
              'The length of an epoch in seconds. This will be the common denominator for all payments, as these are specified in epochs (i.e. if an epoch is 1 week, vestings can be done for 1 week, 2 week, 3 week, etc.). Epoch needs to be greater than 1 week and smaller than 52 weeks',
            jsType: 'number',
            type: 'uint256',
          },
        },
      }

      describe('inputSchema', () => {
        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'RecurringPaymentManager', version: 'v1.0' },
          ] as any)

          expect(inputSchema).toEqual({
            ...expectedBaseInputSchema,
            RecurringPaymentManager: expectedSchema,
          })
        })
      })

      describe.skip('deployFunction', () => {
        const epochLength = '604800' // 1 week in seconds

        it('submits a tx', async () => {
          const { deployFunction } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'RecurringPaymentManager', version: 'v1.0' },
          ] as any)
          const argsCopy = { ...args }
          argsCopy.RecurringPaymentManager = {
            epochLength: epochLength,
          }
          const txHash = await deployFunction(argsCopy as any)
          expect(txHash.length).toEqual(66)
        })
      })
    })
  })
})
