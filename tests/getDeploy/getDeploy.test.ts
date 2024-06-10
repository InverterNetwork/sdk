import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { getDeploy } from '../../src'
import { isAddress } from 'viem'
import { baseArgs, bcArgs, kpiArgs } from './args'
import {
  expected_FM_BC_Restricted_BancorInputSchema,
  expected_LM_PC_KPIRewarderInputSchema,
  expectedBaseInputSchema,
} from './expectedOutputs'
import { USDC_SEPOLIA } from '../../src/getDeploy/constants'

describe('#getDeploy', () => {
  const { publicClient, walletClient } = getTestConnectors()

  describe('Modules: FM_Rebasing_v1, AUT_Roles_v1, PP_Simple_v1', () => {
    const requestedModules = {
      fundingManager: 'FM_Rebasing_v1',
      paymentProcessor: 'PP_Simple_v1',
      authorizer: 'AUT_Roles_v1',
    } as const

    describe('optionalModules: none', () => {
      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy(
            publicClient,
            walletClient,
            requestedModules
          )

          expect(inputs).toEqual(expectedBaseInputSchema)
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulate } = await getDeploy(
            publicClient,
            walletClient,
            requestedModules
          )
          const simulationResult = await simulate(baseArgs)
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
          })

          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [
              {
                inputs: [],
                name: 'LM_PC_Bounties_v1',
              },
            ],
          })
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulate } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_Bounties_v1'],
          })
          const simulationResult = await simulate(baseArgs)
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
      } as const

      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_RecurringPayments_v1'],
          })

          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedSchema],
          })
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulate } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_RecurringPayments_v1'],
          })

          const simulationResult = await simulate({
            ...baseArgs,
            optionalModules: {
              LM_PC_RecurringPayments_v1: {
                epochLength: '604800', // 1 week in seconds,
              },
            },
          })
          expect(isAddress(simulationResult.result as string)).toBeTrue
        })
      })
    })

    // LM_PC_Staking_v1 is not yet deployed & registered
    describe.skip('optional: LM_PC_Staking_v1', () => {
      const expectedSchema = {
        name: 'LM_PC_Staking_v1',
        inputs: [
          {
            name: 'stakingToken',
            description: 'The token users stake to earn rewards.',
            jsType: '0xstring',
            type: 'address',
          },
        ],
      } as const

      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_Staking_v1'],
          })

          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedSchema],
          })
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulate } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_Staking_v1'],
          })

          const simulationResult = await simulate({
            ...baseArgs,
            optionalModules: {
              LM_PC_Staking_v1: {
                stakingToken: USDC_SEPOLIA, // 1 week in seconds,
              },
            },
          })
          expect(isAddress(simulationResult.result as string)).toBeTrue
        })
      })
    })

    describe.skip('optional: LM_PC_KPIRewarder_v1', () => {
      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_KPIRewarder_v1'],
          })

          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expected_LM_PC_KPIRewarderInputSchema],
          })
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulate } = await getDeploy(publicClient, walletClient, {
            ...requestedModules,
            optionalModules: ['LM_PC_KPIRewarder_v1'],
          })

          const simulationResult = await simulate({
            ...baseArgs,
            optionalModules: {
              LM_PC_KPIRewarder_v1: kpiArgs,
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
    } as const

    const expectedInputSchema = {
      ...expectedBaseInputSchema,
      authorizer: {
        ...expectedBaseInputSchema.authorizer,
        name: 'AUT_TokenGated_Roles_v1' as const,
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
          expect(inputs).toEqual(expectedInputSchema)
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as result', async () => {
          const { simulate } = await getDeploy(
            publicClient,
            walletClient,
            requestedModules
          )
          const simulationResult = await simulate(baseArgs)
          expect(isAddress(simulationResult.result as string)).toBeTrue
        })
      })
    })
  })

  describe('Modules: FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1, AUT_TokenGated_Roles_v1, PP_Simple_v1', () => {
    const requestedModules = {
      fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Simple_v1',
      authorizer: 'AUT_Roles_v1',
    } as const

    describe('inputs', () => {
      it('has the correct format', async () => {
        const { inputs } = await getDeploy(
          publicClient,
          walletClient,
          requestedModules
        )
        expect(inputs).toEqual({
          ...expectedBaseInputSchema,
          fundingManager: expected_FM_BC_Restricted_BancorInputSchema,
        })
      })
    })

    describe('simulate', () => {
      it('returns the orchestrator address as result', async () => {
        const { simulate } = await getDeploy(
          publicClient,
          walletClient,
          requestedModules
        )

        const simulationResult = await simulate({
          ...baseArgs,
          fundingManager: bcArgs,
        })
        expect(isAddress(simulationResult.result as string)).toBeTrue
      })
    })
  })
})
