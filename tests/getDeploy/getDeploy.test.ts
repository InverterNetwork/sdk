import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../getTestConnectors'
import { getDeploy } from '../../src'
import { RequestedModules } from '../../src/getDeploy/types'
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
  } as const

  const args = {
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
  } as const

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

  describe.only('Modules: FM_BC_Bancor_Redeeming_VirtualSupply_v1, AUT_TokenGated_Roles_v1, PP_Simple_v1', () => {
    const requestedModules = {
      fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Simple_v1',
      authorizer: 'AUT_Roles_v1',
    } satisfies RequestedModules

    const expectedBCInputSchema = {
      name: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
      inputs: [
        {
          name: 'name',
          type: 'bytes32',
          description: 'The name of the issuance token',
          jsType: '0xstring',
        },
        {
          name: 'symbol',
          type: 'bytes32',
          description: 'The symbol of the issuance token',
          jsType: '0xstring',
        },
        {
          name: 'decimals',
          type: 'uint8',
          description: 'The decimals used within the issuance token',
          jsType: 'numberString',
        },
        {
          name: 'maxSupply',
          type: 'uint256',
          description: 'The max total supply of the token',
          tags: ['decimals:internal:exact:decimals'],
          jsType: 'numberString',
        },
        {
          name: 'formula',
          type: 'address',
          description:
            'The formula contract used to calculate the issucance and redemption rate',
          jsType: '0xstring',
        },
        {
          name: 'reserveRatioForBuying',
          type: 'uint32',
          description:
            'The reserve ratio, expressed in PPM, used for issuance on the bonding curve',
          jsType: 'numberString',
        },
        {
          name: 'reserveRatioForSelling',
          type: 'uint32',
          description:
            'The reserve ratio, expressed in PPM, used for redeeming on the bonding curve',
          jsType: 'numberString',
        },
        {
          name: 'buyFee',
          type: 'uint256',
          description: 'The buy fee expressed in base points',
          jsType: 'numberString',
        },
        {
          name: 'sellFee',
          type: 'uint256',
          description: 'The sell fee expressed in base points',
          jsType: 'numberString',
        },
        {
          name: 'buyIsOpen',
          type: 'bool',
          description:
            'The indicator used for enabling/disabling the buying functionalities on deployment',
          jsType: 'boolean',
        },
        {
          name: 'sellIsOpen',
          type: 'bool',
          description:
            'The indicator used for enabling/disabling the selling functionalties on deployment',
          jsType: 'boolean',
        },
        {
          name: 'initialTokenSupply',
          type: 'uint256',
          description: 'The initial virtual issuance token supply',
          tags: ['decimals:internal:exact:decimals'],
          jsType: 'numberString',
        },
        {
          name: 'initialCollateralSupply',
          type: 'uint256',
          description: 'The initial virtual collateral token supply',
          tags: ['decimals:internal:indirect:acceptedToken'],
          jsType: 'numberString',
        },
        {
          name: 'acceptedToken',
          type: 'address',
          description:
            'The address of the token that will be deposited to the funding manager',
          jsType: '0xstring',
        },
      ],
    }

    describe('inputs', () => {
      it('has the correct format', async () => {
        const { inputs } = await getDeploy(
          publicClient,
          walletClient,
          requestedModules
        )
        expect(inputs).toEqual({
          ...expectedBaseInputSchema,
          fundingManager: expectedBCInputSchema,
        })
      })
    })
  })
})
