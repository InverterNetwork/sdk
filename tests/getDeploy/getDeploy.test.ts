import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../getTestConnectors'
import { getDeploy } from '../../src'
import {
  GetUserArgs,
  ModuleSchema,
  RequestedModules,
} from '../../src/getDeploy/types'
import { isAddress } from 'viem'

describe('#getDeploy', () => {
  const { publicClient, walletClient } = getTestConnectors()
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
    fundingManager: 'FM_Rebasing_v1'
    authorizer: 'AUT_Roles_v1'
    paymentProcessor: 'PP_Simple_v1'
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

  describe('Modules: FM_Rebasing_v1, AUT_Roles_v1, PP_Simple_v1', () => {
    const requestedModules = {
      fundingManager: 'FM_Rebasing_v1',
      paymentProcessor: 'PP_Simple_v1',
      authorizer: 'AUT_Roles_v1',
    } satisfies RequestedModules

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

      describe('simulate', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulate } = await getDeploy(
            publicClient,
            walletClient,
            requestedModules
          )
          const simulationResult = await simulate(args)
          expect(isAddress(simulationResult.result as string)).toBeTrue
        })
      })
    })

    describe('optional: LM_PC_Bounties_v1', () => {
      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_Bounties_v1'],
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

      describe('simulate', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulate } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_Bounties_v1'],
          } as any)
          // @ts-expect-error: bountyManager is not in RequestedModules
          const simulationResult = await simulate(args)
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
            jsType: 'numberString',
            type: 'uint256',
          },
        ],
      }

      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_RecurringPayments_v1'],
          } as any)

          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedSchema],
          } as any) // TODO: fix type to DeploySchema
        })
      })

      describe('simulate', () => {
        const epochLength = '604800' // 1 week in seconds

        it('returns the orchestrator address as result', async () => {
          const { simulate } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_RecurringPayments_v1'],
          } as any)
          const simulationResult = await simulate({
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

  describe('Modules: FM_Rebasing_v1, AUT_TokenGated_Roles_v1, PP_Simple_v1', () => {
    const requestedModules = {
      fundingManager: 'FM_Rebasing_v1',
      paymentProcessor: 'PP_Simple_v1',
      authorizer: 'AUT_TokenGated_Roles_v1',
    } satisfies RequestedModules

    const expectedInputSchema = {
      ...expectedBaseInputSchema,
      authorizer: {
        ...expectedBaseInputSchema.authorizer,
        name: 'AUT_TokenGated_Roles_v1',
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
            ...expectedInputSchema,
          } as any)
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulate } = await getDeploy(
            publicClient,
            walletClient,
            requestedModules
          )
          const simulationResult = await simulate(args)
          expect(isAddress(simulationResult.result as string)).toBeTrue
        })
      })
    })
  })
})
