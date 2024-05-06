import { expect, describe, it } from 'bun:test'
import { isAddress } from 'viem'

import { getTestConnectors } from './getTestConnectors'
import { getDeploy } from '../src'
import {
  ClientInputs,
  ModuleSchema,
  DeploySchema,
  RequestedModules,
} from '../src/getDeploy/types'

describe('#getDeploy', () => {
  const { walletClient, publicClient } = getTestConnectors()

  describe('Modules: RebasingFundingManager, RoleAuthorizer, SimplePaymentProcessor', () => {
    const requestedModules = {
      fundingManager: {
        name: 'RebasingFundingManager',
        version: 'v1.0',
      },
      paymentProcessor: {
        name: 'SimplePaymentProcessor',
        version: 'v1.0',
      },
      authorizer: {
        name: 'RoleAuthorizer',
        version: 'v1.0',
      },
    }

    const expectedBaseInputSchema = {
      orchestrator: {
        name: 'Orchestrator',
        version: 'v1.0',
        inputs: [
          {
            name: 'owner',
            type: 'address',
            jsType: '0xstring',
            description: 'The owner address of the workflow',
          },
          {
            name: 'token',
            type: 'address',
            jsType: '0xstring',
            description: 'The payment token associated with the workflow',
          },
        ],
      },
      fundingManager: {
        name: 'RebasingFundingManager',
        version: 'v1.0',
        inputs: [
          {
            name: 'orchestratorTokenAddress',
            type: 'address',
            jsType: '0xstring',
            description:
              'The address of the token that will be deposited to the funding manager',
          },
        ],
      },
      authorizer: {
        name: 'RoleAuthorizer',
        version: 'v1.0',
        inputs: [
          {
            name: 'initialOwner',
            type: 'address',
            jsType: '0xstring',
            description: 'The initial owner of the workflow',
          },
          {
            name: 'initialManager',
            type: 'address',
            jsType: '0xstring',
            description: 'The initial manager of the workflow',
          },
        ],
      },
    }

    const args = {
      Orchestrator: {
        owner: '0x5eb14c2e7D0cD925327d74ae4ce3fC692ff8ABEF' as `0x${string}`,
        token: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053' as `0x${string}`,
      },
      RebasingFundingManager: {
        orchestratorTokenAddress: '0x5eb14c2e7D0cD925327d74ae4ce3fC692ff8ABEF',
      },
      RoleAuthorizer: {
        initialOwner: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
        initialManager: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
      },
    } as ClientInputs

    describe('optionalModules: none', () => {
      describe('inputSchema', () => {
        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(
            walletClient,
            publicClient,
            requestedModules as RequestedModules
          )
          expect(inputSchema).toEqual(expectedBaseInputSchema as any)
        })
      })

      describe('simulateDeploy', () => {
        it('returns the orchestrator address', async () => {
          const { simulateDeploy } = await getDeploy(
            walletClient,
            publicClient,
            requestedModules as RequestedModules
          )
          const orchestratorAddress = await simulateDeploy(args)
          expect(isAddress(orchestratorAddress)).toBeTrue
        })
      })

      describe('deploy', () => {
        it('submits a tx', async () => {
          const { deploy } = await getDeploy(
            walletClient,
            publicClient,
            requestedModules as RequestedModules
          )
          const { txHash } = await deploy(args)
          expect(txHash.length).toEqual(66)
        })
      })
    })

    describe('optionalModules: MetadataManager', () => {
      describe('inputSchema', () => {
        const expectedMetadataManagerSchema = {
          version: 'v1.0',
          name: 'MetadataManager',
          inputs: [
            {
              name: 'managerName',
              type: 'string',
              description: 'The (user-) name of the manager',
              jsType: 'string',
            },
            {
              name: 'managerAccount',
              type: 'address',
              description: 'The address of the manager',
              jsType: '0xstring',
            },
            {
              name: 'managerTwitterHandle',
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
              jsType: 'string[]',
            },
            {
              name: 'categories',
              type: 'string[]',
              description: 'An array of categories of the workflow/orchestator',
              jsType: 'string[]',
            },
            {
              name: 'memberName',
              type: 'string',
              description: 'The (user-) name of the member',
              jsType: 'string',
            },
            {
              name: 'memberAccount',
              type: 'address',
              description: 'The address of the member',
              jsType: '0xstring',
            },
            {
              name: 'memberUrl',
              type: 'string',
              description: 'A url of the member',
              jsType: 'string',
            },
          ],
        } as ModuleSchema

        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(walletClient, publicClient, {
            ...requestedModules,
            optionalModules: [{ name: 'MetadataManager', version: 'v1.0' }],
          } as any)
          expect(inputSchema).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedMetadataManagerSchema],
          } as DeploySchema)
        })
      })

      describe.skip('deploy', () => {
        it('submits a tx', async () => {
          const { deploy } = await getDeploy(walletClient, publicClient, {
            ...requestedModules,
            optionalModules: [{ name: 'MetadataManager', version: 'v1.0' }],
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
          }
          const { txHash } = await deploy({
            ...args,
            MetadataManager: metadataManagerArgs,
          })
          expect(txHash.length).toEqual(66)
        })
      })
    })

    describe('optional: BountyManager', () => {
      describe('inputSchema', () => {
        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(walletClient, publicClient, {
            ...requestedModules,
            optionalModules: [{ name: 'BountyManager', version: 'v1.0' }],
          } as any)
          expect(inputSchema).toEqual({
            ...(expectedBaseInputSchema as any),
          })
        })
      })

      describe.only('deploy', () => {
        it('has the correct format', async () => {
          const { deploy } = await getDeploy(walletClient, publicClient, {
            ...requestedModules,
            optionalModules: [{ name: 'BountyManager', version: 'v1.0' }],
          } as any)
          const { txHash } = await deploy(args)
          expect(txHash.length).toEqual(66)
        })
      })
    })

    describe('optional: RecurringPaymentManager', () => {
      const expectedSchema = {
        name: 'RecurringPaymentManager',
        version: 'v1.0',
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

      describe('inputSchema', () => {
        it('has the correct format', async () => {
          const { inputSchema } = await getDeploy(walletClient, publicClient, {
            ...requestedModules,
            optionalModules: [
              { name: 'RecurringPaymentManager', version: 'v1.0' },
            ],
          } as any)

          expect(inputSchema).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedSchema],
          } as DeploySchema)
        })
      })

      describe.skip('deploy', () => {
        const epochLength = '604800' // 1 week in seconds

        it('submits a tx', async () => {
          const { deploy } = await getDeploy(walletClient, publicClient, {
            ...requestedModules,
            optionalModules: [
              { name: 'RecurringPaymentManager', version: 'v1.0' },
            ],
          } as any)
          const { txHash } = await deploy({
            ...args,
            RecurringPaymentManager: {
              epochLength: epochLength,
            },
          })
          expect(txHash.length).toEqual(66)
        })
      })
    })
  })
})
