import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../getTestConnectors'
import { getDeploy } from '../../src'
import { Hex, isAddress } from 'viem'

// ===============CONSTANTS_START================

const USDC_SEPOLIA = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' as Hex // USDC has 6 decimals
const mockAddress = '0x80f8493761a18d29fd77c131865f9cf62b15e62a' as Hex // self-deployed mock contract

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

const baseArgs = {
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

const expected_FM_BC_Restricted_BancorInputSchema = {
  name: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
  inputs: [
    {
      components: [
        {
          name: 'name',
          type: 'string',
          description: 'The name of the issuance token',
        },
        {
          name: 'symbol',
          type: 'string',
          description: 'The symbol of the issuance token',
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
      ],
      name: 'issuanceToken',
      type: 'tuple',
    },
    {
      name: 'tokenAdmin',
      type: 'address',
      description: 'The admin of the token',
      jsType: '0xstring',
    },
    {
      components: [
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
      ],
      name: 'bondingCurveParams',
      type: 'tuple',
    },
    {
      name: 'acceptedToken',
      type: 'address',
      description:
        'The address of the token that will be deposited to the funding manager',
      jsType: '0xstring',
    },
  ],
} as const

const bcArgs = {
  issuanceToken: {
    name: 'Project Issuance Token',
    symbol: 'QACC',
    decimals: '18',
    maxSupply: '115792',
  },
  tokenAdmin: mockAddress,
  bondingCurveParams: {
    formula: mockAddress,
    reserveRatioForBuying: '333333',
    reserveRatioForSelling: '333333',
    buyFee: '0',
    sellFee: '100',
    buyIsOpen: true,
    sellIsOpen: false,
    initialTokenSupply: '100',
    initialCollateralSupply: '33',
  },
  acceptedToken: USDC_SEPOLIA, //USDC
} as const

// ===============CONSTANTS_END================

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

    describe.only('simulate', () => {
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
