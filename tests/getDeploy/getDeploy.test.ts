import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../getTestConnectors'
import { getDeploy } from '../../src'
import { RequestedModules } from '../../src/getDeploy/types'
import { isAddress } from 'viem'

describe('#getDeploy', () => {
  const { publicClient, walletClient } = getTestConnectors()

  const mockAddress = '0x80f8493761a18d29fd77c131865f9cf62b15e62a' // self-deployed mock contract
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
        it.only('returns the orchestrator address as result', async () => {
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

  describe('Modules: FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1, AUT_TokenGated_Roles_v1, PP_Simple_v1', () => {
    const requestedModules = {
      fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Simple_v1',
      authorizer: 'AUT_Roles_v1',
    } satisfies RequestedModules

    const expectedBCInputSchema = {
      name: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
      inputs: [
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
        } as any)
      })
    })

    describe('simulate', () => {
      const bcArgs = {
        name: 'Project Issuance Token',
        symbol: 'QACC',
        decimals: '18',
        maxSupply: '115792',
        formula: mockAddress,
        reserveRatioForBuying: '333333',
        reserveRatioForSelling: '333333',
        buyFee: '0',
        sellFee: '100',
        buyIsOpen: true,
        sellIsOpen: false,
        initialTokenSupply: '100',
        initialCollateralSupply: '33',
        acceptedToken: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', //USDC
      }

      // it('has the correct format', async () => {
      //   const { inputs } = await getDeploy(
      //     publicClient,
      //     walletClient,
      //     requestedModules
      //   )
      //   expect(inputs).toEqual({
      //     ...expectedBaseInputSchema,
      //     fundingManager: expectedBCInputSchema,
      //   } as any)
      // })

      it('returns the orchestrator address as result', async () => {
        const { simulate } = await getDeploy(
          publicClient,
          walletClient,
          requestedModules
        )
        const simulationResult = await simulate({
          ...args,
          fundingManager: bcArgs,
        } as any)
        expect(isAddress(simulationResult.result as string)).toBeTrue
      })
    })

    describe('decoder', () => {
      const CURVE_TOKEN_NAME = 'Project Issuance Token'
      const CURVE_TOKEN_SYMBOL = 'QACC'
      const CURVE_TOKEN_DECIMALS = 18n
      const RESERVE_RATIO_FOR_BUYING = 333_333n
      const RESERVE_RATIO_FOR_SELLING = 333_333n
      const BUY_FEE = 0n
      const SELL_FEE = 100n
      const BUY_IS_OPEN = true
      const SELL_IS_OPEN = false
      const INITIAL_ISSUANCE_SUPPLY = 100n
      const INITIAL_COLLATERAL_SUPPLY = 33n
      const BONDING_CURVE_COLLATERAL_TOKEN =
        '0x1000000000000000000000000000000000000008'
      const BANCOR_FORMULA_ADDRESS =
        '0x1000000000000000000000000000000000000009'
      const OWNER = privateKeyToAccount(
        '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba'
      )

      // string name; // The name of the issuance token
      // string symbol; // The symbol of the issuance token
      // uint8 decimals; // The decimals used within the issuance token
      // uint maxSupply; // The maximum supply of the issuance token

      // address formula; // The formula contract used to calculate the issucance and redemption rate
      // uint32 reserveRatioForBuying; // The reserve ratio, expressed in PPM, used for issuance on the bonding curve
      // uint32 reserveRatioForSelling; // The reserve ratio, expressed in PPM, used for redeeming on the bonding curve
      // uint buyFee; // The buy fee expressed in base points
      // uint sellFee; // The sell fee expressed in base points
      // bool buyIsOpen; // The indicator used for enabling/disabling the buying functionalities on deployment
      // bool sellIsOpen; // The indicator used for enabling/disabling the selling functionalties on deployment
      // uint initialIssuanceSupply; // The initial virtual issuance token supply
      // uint initialCollateralSupply; // The initial virtual collateral token supply

      it('decodes raw', async () => {
        const types = [
          { name: 'name', type: 'string' },
          { name: 'symbol', type: 'string' },
          { name: 'decimals', type: 'uint8' },
          { name: 'maxSupply', type: 'uint256' },

          { name: 'tokenAdmin', type: 'address' },

          { name: 'formula', type: 'address' },
          { name: 'reserveRatioForBuying', type: 'uint32' },
          { name: 'reserveRatioForSelling', type: 'uint32' },
          { name: 'buyFee', type: 'uint256' },
          { name: 'sellFee', type: 'uint256' },
          { name: 'buyIsOpen', type: 'bool' },
          { name: 'sellIsOpen', type: 'bool' },
          { name: 'initialIssuanceSupply', type: 'uint256' },
          { name: 'initialCollateralSupply', type: 'uint256' },

          { name: 'acceptedToken', type: 'address' },
        ]

        const x = decodeAbiParameters(
          types,
          '0x00000000000000000000000000000000000000000000000000000000000001800000000000000000000000009518a55e5cd4ac650a37a6ab6c352a3146d2c9bd000000000000000000000000823f6ac80759f2e037eaf706d45cb4b47b80926c00000000000000000000000000000000000000000000000000000000000516150000000000000000000000000000000000000000000000000000000000051615000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000021000000000000000000000000b637ce56afdb659ab7f85d1293e20ce661445db4000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000012ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000001650726f6a6563742049737375616e636520546f6b656e0000000000000000000000000000000000000000000000000000000000000000000000000000000000045141434300000000000000000000000000000000000000000000000000000000'
        )

        // console.log(x)
        // const x = decodeAbiParameters(
        //   [
        //     { name: 'x', type: 'string' },
        //     { name: 'y', type: 'uint' },
        //     { name: 'z', type: 'bool' },
        //   ],
        //   '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000'
        // )

        // console.log(x)
      })

      it('decodes as struct', async () => {
        const structs = [
          {
            components: [
              {
                name: 'name',
                type: 'string',
              },
              {
                name: 'symbol',
                type: 'string',
              },
              {
                name: 'decimals',
                type: 'uint8',
              },
              {
                name: 'maxSupply',
                type: 'uint256',
              },
            ],
            name: 'issuanceToken',
            type: 'tuple',
          },
          {
            name: 'tokenAdmin',
            type: 'address',
          },
          {
            components: [
              {
                name: 'formula',
                type: 'address',
              },
              {
                name: 'reserveRatioForBuying',
                type: 'uint32',
              },
              {
                name: 'reserveRatioForSelling',
                type: 'uint32',
              },
              {
                name: 'buyFee',
                type: 'uint256',
              },
              {
                name: 'sellFee',
                type: 'uint256',
              },
              {
                name: 'buyIsOpen',
                type: 'bool',
              },
              {
                name: 'sellIsOpen',
                type: 'bool',
              },
              {
                name: 'initialIssuanceSupply',
                type: 'uint256',
              },
              {
                name: 'initialCollateralSupply',
                type: 'uint256',
              },
            ],
            name: 'bondingCurveParams',
            type: 'tuple',
          },
          { name: 'acceptedToken', type: 'address' },
        ]

        const encodedData = encodeAbiParameters(structs, [
          {
            name: CURVE_TOKEN_NAME,
            symbol: CURVE_TOKEN_SYMBOL,
            decimals: CURVE_TOKEN_DECIMALS,
            maxSupply: INITIAL_ISSUANCE_SUPPLY,
          },
          OWNER.address,
          {
            formula: BANCOR_FORMULA_ADDRESS,
            reserveRatioForBuying: RESERVE_RATIO_FOR_BUYING,
            reserveRatioForSelling: RESERVE_RATIO_FOR_SELLING,
            buyFee: BUY_FEE,
            sellFee: SELL_FEE,
            buyIsOpen: BUY_IS_OPEN,
            sellIsOpen: SELL_IS_OPEN,
            initialIssuanceSupply: INITIAL_ISSUANCE_SUPPLY,
            initialCollateralSupply: INITIAL_COLLATERAL_SUPPLY,
          },
          BONDING_CURVE_COLLATERAL_TOKEN,
        ])

        console.log(encodedData)
      })
    })
  })
})
