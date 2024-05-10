import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from './getTestConnectors'
import { getDeploy } from '../src'
import { GetUserArgs, ModuleSchema } from '../src/getDeploy/types'
import { isAddress } from 'viem'

describe('#getDeploy', () => {
  const { publicClient, walletClient } = getTestConnectors()

  describe('Modules: RebasingFundingManager, RoleAuthorizer, SimplePaymentProcessor', () => {
    const requestedModules = {
      fundingManager: {
        name: 'FM_Rebasing_v1',
        version: '1',
      },
      paymentProcessor: {
        name: 'PP_Simple_v1',
        version: '1',
      },
      authorizer: {
        name: 'AUT_Roles_v1',
        version: '1',
      },
    } as const

    const expectedBaseInputSchema = {
      orchestrator: {
        name: 'Orchestrator_v1',
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
        name: 'FM_Rebasing_v1',
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
        name: 'AUT_Roles_v1',
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
      paymentProcessor: {
        inputs: [],
        name: 'PP_Simple_v1',
      },
    }

    const args: GetUserArgs<{
      fundingManager: { name: 'FM_Rebasing_v1'; version: '1' }
      authorizer: { name: 'AUT_Roles_v1'; version: '1' }
      paymentProcessor: { name: 'PP_Simple_v1'; version: '1' }
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
          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
          } as any)
        })
      })

      describe('simulateRun', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulateRun } = await getDeploy(
            publicClient,
            walletClient,
            requestedModules
          )
          const simulationResult = await simulateRun(args)
          expect(isAddress(simulationResult.result as string)).toBeTrue
        })
      })
    })

    describe('optionalModules: MetadataManager_v1', () => {
      describe('inputs', () => {
        const expectedMetadataManagerSchema = {
          name: 'MetadataManager_v1',
          inputs: [
            {
              name: 'managerName',
              type: 'string',
              description: 'The (user-) name of the manager',
            },
            {
              name: 'managerAccount',
              type: 'address',
              jsType: '0xstring',
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
              jsType: '0xstring',
              description: 'The address of the member',
            },
            {
              name: 'memberUrl',
              type: 'string',
              description: 'A url of the member',
            },
          ],
        } as ModuleSchema<'MetadataManager_v1', '1'>

        it('has the correct format', async () => {
          const { inputs } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [{ name: 'MetadataManager_v1', version: '1' }],
          } as any)
          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedMetadataManagerSchema],
          } as any) // TODO: fix type to DeploySchema
        })
      })

      describe.skip('simulateRun', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulateRun } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [{ name: 'MetadataManager_v1', version: '1' }],
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

          const simulationResult = await simulateRun({
            ...args,
            // @ts-expect-error: metadataManager is not in RequestedModules
            optionalModules: { MetadataManager_v1: metadataManagerArgs },
          })
          expect(isAddress(simulationResult.result as string)).toBeTrue
        })
      })
    })

    describe('optional: LM_PC_Bounties_v1', () => {
      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [{ name: 'LM_PC_Bounties_v1', version: '1' }],
          } as any)
          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [
              {
                inputs: [],
                name: 'LM_PC_Bounties_v1',
              },
            ],
          } as any)
        })
      })

      describe('simulateRun', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulateRun } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [{ name: 'LM_PC_Bounties_v1', version: '1' }],
          } as any)
          // @ts-expect-error: bountyManager is not in RequestedModules
          const simulationResult = await simulateRun(args)
          expect(isAddress(simulationResult.result as string)).toBeTrue
        })
      })
    })

    describe('optional: LM_PC_RecurringPayments_v1', () => {
      const expectedSchema = {
        name: 'LM_PC_RecurringPayments_v1',
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
              { name: 'LM_PC_RecurringPayments_v1', version: '1' },
            ],
          } as any)

          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedSchema],
          } as any) // TODO: fix type to DeploySchema
        })
      })

      describe('simulateRun', () => {
        const epochLength = '604800' // 1 week in seconds

        it('returns the orchestrator address as result', async () => {
          const { simulateRun } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: [
              { name: 'LM_PC_RecurringPayments_v1', version: '1' },
            ],
          } as any)
          const simulationResult = await simulateRun({
            ...args,
            // @ts-expect-error: recurringPaymentManager is not in RequestedModules
            optionalModules: {
              LM_PC_RecurringPayments_v1: {
                epochLength: BigInt(epochLength),
              },
            },
          })
          expect(isAddress(simulationResult.result as string)).toBeTrue
        })
      })
    })
  })
})
