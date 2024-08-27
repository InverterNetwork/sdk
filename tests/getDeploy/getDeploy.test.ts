import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { getDeploy, type RequestedModules } from '../../src'
import { isAddress } from 'viem'
import {
  expected_FM_BC_Restricted_BancorInputSchema,
  expected_LM_PC_KPIRewarderInputSchema,
  expectedBaseInputSchema,
} from './expectedOutputs'
import { USDC_SEPOLIA } from '../../src/getDeploy/constants'
import { getDeployArgs, getKpiArgs } from '../testHelpers/getTestArgs'

describe('#getDeploy', () => {
  const { publicClient, walletClient } = getTestConnectors()
  const address = walletClient.account.address

  describe('Modules: FM_DepositVault_v1, AUT_Roles_v1, PP_Simple_v1', () => {
    const requestedModules = {
      fundingManager: 'FM_DepositVault_v1',
      paymentProcessor: 'PP_Simple_v1',
      authorizer: 'AUT_Roles_v1',
    } as const satisfies RequestedModules

    describe('optionalModules: none', () => {
      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules,
          })

          expect(inputs).toEqual(expectedBaseInputSchema)
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as orchestratorAddress', async () => {
          const { simulate } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules,
          })
          const { orchestratorAddress } = await simulate(
            getDeployArgs(requestedModules, address)
          )
          expect(isAddress(orchestratorAddress)).toBeTrue
        })
      })
    })

    describe('optional: LM_PC_Bounties_v1', () => {
      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules: {
              ...requestedModules,
              optionalModules: ['LM_PC_Bounties_v1'],
            },
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
        it('returns the orchestrator address as orchestratorAddress', async () => {
          const { simulate } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules: {
              ...requestedModules,
              optionalModules: ['LM_PC_Bounties_v1'],
            },
          })
          const { orchestratorAddress } = await simulate(
            getDeployArgs(requestedModules, address)
          )
          expect(isAddress(orchestratorAddress)).toBeTrue
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
            type: 'uint256',
          },
        ],
      } as const

      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules: {
              ...requestedModules,
              optionalModules: ['LM_PC_RecurringPayments_v1'],
            },
          })

          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedSchema],
          })
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as orchestratorAddress', async () => {
          const { simulate } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules: {
              ...requestedModules,
              optionalModules: ['LM_PC_RecurringPayments_v1'],
            },
          })

          const { orchestratorAddress } = await simulate({
            ...getDeployArgs(requestedModules, address),
            optionalModules: {
              LM_PC_RecurringPayments_v1: {
                epochLength: '604800', // 1 week in seconds,
              },
            },
          })
          expect(isAddress(orchestratorAddress)).toBeTrue
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
            type: 'address',
          },
        ],
      } as const

      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules: {
              ...requestedModules,
              optionalModules: ['LM_PC_Staking_v1'],
            },
          })

          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expectedSchema],
          })
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as orchestratorAddress', async () => {
          const { simulate } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules: {
              ...requestedModules,
              optionalModules: ['LM_PC_Staking_v1'],
            },
          })

          const { orchestratorAddress } = await simulate({
            ...getDeployArgs(requestedModules, address),
            optionalModules: {
              LM_PC_Staking_v1: {
                stakingToken: USDC_SEPOLIA, // 1 week in seconds,
              },
            },
          })
          expect(isAddress(orchestratorAddress)).toBeTrue
        })
      })
    })

    describe.skip('optional: LM_PC_KPIRewarder_v1', () => {
      describe('inputs', () => {
        it('has the correct format', async () => {
          const { inputs } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules: {
              ...requestedModules,
              optionalModules: ['LM_PC_KPIRewarder_v1'],
            },
          })

          expect(inputs).toEqual({
            ...expectedBaseInputSchema,
            optionalModules: [expected_LM_PC_KPIRewarderInputSchema],
          })
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as orchestratorAddress', async () => {
          const { simulate } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules: {
              ...requestedModules,
              optionalModules: ['LM_PC_KPIRewarder_v1'],
            },
          })

          const { orchestratorAddress } = await simulate({
            ...getDeployArgs(requestedModules, address),
            optionalModules: {
              LM_PC_KPIRewarder_v1: getKpiArgs(address),
            },
          })
          expect(isAddress(orchestratorAddress)).toBeTrue
        })
      })
    })
  })

  describe('Modules: FM_DepositVault_v1, AUT_TokenGated_Roles_v1, PP_Simple_v1', () => {
    const requestedModules = {
      fundingManager: 'FM_DepositVault_v1',
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
          const { inputs } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules,
          })
          expect(inputs).toEqual(expectedInputSchema)
        })
      })

      describe('simulate', () => {
        it('returns the orchestrator address as orchestratorAddress', async () => {
          const { simulate } = await getDeploy({
            publicClient,
            walletClient,
            requestedModules,
          })
          const { orchestratorAddress } = await simulate(
            getDeployArgs(requestedModules, address)
          )
          expect(isAddress(orchestratorAddress)).toBeTrue
        })
      })
    })
  })

  describe('Modules: FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1, AUT_TokenGated_Roles_v1, PP_Simple_v1', () => {
    const requestedModules = {
      fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Simple_v1',
      authorizer: 'AUT_Roles_v1',
    } as const satisfies RequestedModules

    describe('inputs', () => {
      it('has the correct format', async () => {
        const { inputs } = await getDeploy({
          publicClient,
          walletClient,
          requestedModules,
        })
        expect(inputs).toEqual({
          ...expectedBaseInputSchema,
          fundingManager: expected_FM_BC_Restricted_BancorInputSchema,
        })
      })
    })

    describe('simulate', () => {
      it('returns the orchestrator address as orchestratorAddress', async () => {
        const { simulate } = await getDeploy({
          publicClient,
          walletClient,
          requestedModules,
        })

        const { orchestratorAddress } = await simulate(
          getDeployArgs(requestedModules, address)
        )

        expect(isAddress(orchestratorAddress)).toBeTrue
      })
    })
  })
})
