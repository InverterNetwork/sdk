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
      orchestrator: {
        name: 'Orchestrator',
        version: 'v1.0',
        params: [
          {
            name: 'owner',
            type: 'address',
            jsType: 'string',
            description: 'The owner address of the workflow',
          },
          {
            name: 'token',
            type: 'address',
            jsType: 'string',
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
            jsType: 'string',
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
            jsType: 'string',
            description: 'The initial owner of the workflow',
          },
          {
            name: 'initialManager',
            type: 'address',
            jsType: 'string',
            description: 'The initial manager of the workflow',
          },
        ],
      },
      paymentProcessor: {
        name: 'SimplePaymentProcessor',
        version: 'v1.0',
        params: [],
      },
      optionalModules: [],
    }

    let args: any

    beforeEach(async () => {
      const { inputSchema } = await getDeploy(
        walletClient,
        requestedModules as any
      )
      args = { ...inputSchema }
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
          expect(txHash).pass()
        })
      })
    })

    describe.skip('optionalModules: MetadataManager', () => {
      describe('inputSchema', () => {
        const expectedMetadataManagerSchema = {
          name: 'MetadataManager',
          version: 'v1.0',
          params: [
            {
              name: 'name',
              type: 'string',
              description: 'The (user-) name of the manager',
              jsType: 'string',
            },
            {
              name: 'account',
              type: 'address',
              description: 'The address of the manager',
              jsType: 'string',
            },
            {
              name: 'twitterHandle',
              type: 'string',
              description: 'The twitter handle of the manager',
              jsType: 'string',
            },
            {
              name: 'title',
              type: 'string',
              description: 'The name of the workflow/orchestrator',
              jsType: 'string',
            },
            {
              name: 'descriptionShort',
              type: 'string',
              description: 'The short description of the workflow/orchestrator',
              jsType: 'string',
            },
            {
              name: 'descriptionLong',
              type: 'string',
              description: 'The long description of the workflow/orchestrator',
              jsType: 'string',
            },
            {
              name: 'externalMedias',
              type: 'string[]',
              description: 'An array of links to external medias',
              jsType: undefined,
            },
            {
              name: 'categories',
              type: 'string[]',
              description: 'An array of categories of the workflow/orchestator',
              jsType: undefined,
            },
            {
              name: 'name',
              type: 'string',
              description: 'The (user-) name of the member',
              jsType: 'string',
            },
            {
              name: 'account',
              type: 'address',
              description: 'The address of the member',
              jsType: 'string',
            },
            {
              name: 'url',
              type: 'string',
              description: 'A url of the member',
              jsType: 'string',
            },
          ],
        }

        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'MetadataManager', version: 'v1.0' },
          ] as any)
          expect(inputSchema).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedMetadataManagerSchema],
          })
        })
      })

      describe('deployFunction', () => {
        const metadataManagerParams = [
          'example manager name',
          '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053', // manager address
          '@twitter_handle',
          'example workflow name',
          'example short description',
          'example long description',
          ['example external media 1', 'example external media 2'],
          ['example category 1', 'example category 2'],
          'example member name',
          '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053', // member address
          'example member url',
        ]

        it('submits a tx', async () => {
          const { deployFunction } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'MetadataManager', version: 'v1.0' },
          ] as any)
          const argsCopy = { ...args }
          argsCopy.optionalModules = [
            {
              name: 'MetadataManager',
              version: 'v1.0',
              params: metadataManagerParams,
            },
          ]
          const txHash = await deployFunction(argsCopy as any)
          expect(txHash).pass()
        })
      })
    })

    describe('optional: BountyManager', () => {
      describe('inputSchema', () => {
        const expectedBountyManagerSchema = {
          name: 'BountyManager',
          version: 'v1.0',
          params: [],
        }

        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'BountyManager', version: 'v1.0' },
          ] as any)

          expect(inputSchema).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedBountyManagerSchema],
          })
        })
      })

      describe('deployFunction', () => {
        const expectedSchema = {
          name: 'BountyManager',
          version: 'v1.0',
          params: [],
        }

        it('has the correct format', async () => {
          const { deployFunction } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'BountyManager', version: 'v1.0' },
          ] as any)
          const argsCopy = { ...args }
          argsCopy.optionalModules = [
            {
              name: 'BountyManager',
              version: 'v1.0',
              params: [],
            },
          ]
          const txHash = await deployFunction(argsCopy as any)
          expect(txHash).pass()
        })
      })
    })

    describe.skip('optional: RecurringPaymentManager', () => {
      const expectedSchema = {
        name: 'RecurringPaymentManager',
        version: 'v1.0',
        params: [
          {
            description:
              'The length of an epoch in seconds. This will be the common denominator for all payments, as these are specified in epochs (i.e. if an epoch is 1 week, vestings can be done for 1 week, 2 week, 3 week, etc.). Epoch needs to be greater than 1 week and smaller than 52 weeks',
            jsType: 'number',
            name: 'epochLength',
            type: 'uint256',
          },
        ],
      }

      describe('inputSchema', () => {
        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'RecurringPaymentManager', version: 'v1.0' },
          ] as any)

          expect(inputSchema).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedSchema],
          })
        })
      })

      describe('deployFunction', () => {
        const epochLength = '604800' // 1 week in seconds

        it('has the correct format', async () => {
          const { deployFunction } = await getDeploy(walletClient, [
            ...requestedModules,
            { name: 'RecurringPaymentManager', version: 'v1.0' },
          ] as any)
          const argsCopy = { ...args }
          argsCopy.optionalModules = [
            {
              name: 'RecurringPaymentManager',
              version: 'v1.0',
              params: [epochLength],
            },
          ]
          const txHash = await deployFunction(argsCopy as any)
          expect(txHash).pass()
        })
      })
    })
  })
})
