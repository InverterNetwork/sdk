import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from './getTestConnectors'
import { getDeploy } from '../src'
import { GetUserArgs, ModuleSchema } from '../src/getDeploy/types'

describe('#getDeploy', () => {
  const { publicClient, walletClient } = getTestConnectors()

  describe('Modules: RebasingFundingManager, RoleAuthorizer, SimplePaymentProcessor', () => {
    const requestedModules = {
      fundingManager: {
        name: 'RebasingFundingManager',
        version: '1',
      },
      paymentProcessor: {
        name: 'SimplePaymentProcessor',
        version: '1',
      },
      authorizer: {
        name: 'RoleAuthorizer',
        version: '1',
      },
    } as const

    const expectedBaseInputSchema = {
      orchestrator: {
        name: 'Orchestrator',
        version: '1',
        inputs: [
          {
            name: 'owner',
            type: 'address',
            description: 'The owner address of the workflow',
          },
          {
            name: 'token',
            type: 'address',
            description: 'The payment token associated with the workflow',
          },
        ],
      },
      fundingManager: {
        name: 'RebasingFundingManager',
        version: '1',
        inputs: [
          {
            name: 'orchestratorTokenAddress',
            type: 'address',
            description:
              'The address of the token that will be deposited to the funding manager',
          },
        ],
      },
      authorizer: {
        name: 'RoleAuthorizer',
        version: '1',
        inputs: [
          {
            name: 'initialOwner',
            type: 'address',
            description: 'The initial owner of the workflow',
          },
          {
            name: 'initialManager',
            type: 'address',
            description: 'The initial manager of the workflow',
          },
        ],
      },
    }

    const args: GetUserArgs<{
      fundingManager: { name: 'RebasingFundingManager'; version: '1' }
      authorizer: { name: 'RoleAuthorizer'; version: '1' }
      paymentProcessor: { name: 'SimplePaymentProcessor'; version: '1' }
    }> = {
      orchestrator: {
        owner: '0x5eb14c2e7D0cD925327d74ae4ce3fC692ff8ABEF',
        token: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
      },
      fundingManager: {
        orchestratorTokenAddress: '0x5eb14c2e7D0cD925327d74ae4ce3fC692ff8ABEF',
      },
      authorizer: {
        initialOwner: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
        initialManager: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
      },
    }

    describe('optionalModules: none', () => {
      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy(
            publicClient,
            walletClient,
            requestedModules
          )
          expect(inputs).toEqual(expectedBaseInputSchema as any)
        })
      })

      describe('deploymentFunction', () => {
        it('submits a tx', async () => {
          const { run } = await getDeploy(
            publicClient,
            walletClient,
            requestedModules
          )
          const { transactionHash } = await run(args)
          expect(transactionHash.length).toEqual(66)
        })
      })
    })

    describe('optionalModules: MetadataManager', () => {
      describe('inputs', () => {
        const expectedMetadataManagerSchema = {
          version: '1',
          name: 'MetadataManager',
          inputs: [
            {
              name: 'managerName',
              type: 'string',
              description: 'The (user-) name of the manager',
            },
            {
              name: 'managerAccount',
              type: 'address',
              description: 'The address of the manager',
            },
            {
              name: 'managerTwitterHandle',
              type: 'string',
              description: 'The twitter handle of the manager',
            },
            {
              name: 'title',
              type: 'string',
              description: 'The name of the workflow/orchestrator',
            },
            {
              name: 'descriptionShort',
              type: 'string',
              description: 'The short description of the workflow/orchestrator',
            },
            {
              name: 'descriptionLong',
              type: 'string',
              description: 'The long description of the workflow/orchestrator',
            },
            {
              name: 'externalMedias',
              type: 'string[]',
              description: 'An array of links to external medias',
            },
            {
              name: 'categories',
              type: 'string[]',
              description: 'An array of categories of the workflow/orchestator',
            },
            {
              name: 'memberName',
              type: 'string',
              description: 'The (user-) name of the member',
            },
            {
              name: 'memberAccount',
              type: 'address',
              description: 'The address of the member',
            },
            {
              name: 'memberUrl',
              type: 'string',
              description: 'A url of the member',
            },
          ],
        } as ModuleSchema<'MetadataManager', '1'>

        it('has the correct format', async () => {
          const { inputs } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [{ name: 'MetadataManager', version: '1' }],
          } as any)
          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedMetadataManagerSchema],
          } as any) // TODO: fix type to DeploySchema
        })
      })

      describe.skip('run', () => {
        it('submits a tx', async () => {
          const { run } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [{ name: 'MetadataManager', version: '1' }],
          } as any)
          const metadataManagerArgs = {
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
          } as const
          const { transactionHash } = await run({
            ...args,
            // @ts-expect-error: metadataManager is not in RequestedModules
            optionalModules: [metadataManagerArgs],
          })
          expect(transactionHash.length).toEqual(66)
        })
      })
    })

    describe('optional: BountyManager', () => {
      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [{ name: 'BountyManager', version: '1' }],
          } as any)
          expect(inputs).toEqual(expectedBaseInputSchema as any)
        })
      })

      describe('run', () => {
        it('has the correct format', async () => {
          const { run } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [{ name: 'BountyManager', version: '1' }],
          } as any)
          // @ts-expect-error: bountyManager is not in RequestedModules
          const txHash = (await run(args)) as string
          expect(txHash.length).toEqual(66)
        })
      })
    })

    describe('optional: RecurringPaymentManager', () => {
      const expectedSchema = {
        name: 'RecurringPaymentManager',
        version: '1',
        inputs: [
          {
            name: 'epochLength',
            description:
              'The length of an epoch in seconds. This will be the common denominator for all payments, as these are specified in epochs (i.e. if an epoch is 1 week, vestings can be done for 1 week, 2 week, 3 week, etc.). Epoch needs to be greater than 1 week and smaller than 52 weeks',
            jsType: 'string',
            type: 'uint256',
          },
        ],
      }

      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [
              { name: 'RecurringPaymentManager', version: '1' },
            ],
          } as any)

          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedSchema],
          } as any) // TODO: fix type to DeploySchema
        })
      })

      describe('run', () => {
        const epochLength = '604800' // 1 week in seconds

        it('submits a tx', async () => {
          const { run } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [
              { name: 'RecurringPaymentManager', version: '1' },
            ],
          } as any)
          const { transactionHash } = await run({
            ...args,
            // @ts-expect-error: recurringPaymentManager is not in RequestedModules
            paymentProcessor: {
              epochLength: BigInt(epochLength),
            },
          })
          expect(transactionHash.length).toEqual(66)
        })
      })
    })
  })
})
