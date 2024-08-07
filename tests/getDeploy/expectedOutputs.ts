import { ORCHESTRATOR_CONFIG } from '../../src/getDeploy/constants'

export const expectedBaseInputSchema = {
  orchestrator: ORCHESTRATOR_CONFIG,

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
        name: 'initialAdmin',
        type: 'address',
        jsType: '0xstring',
        description: 'The initial admin of the workflow',
      },
    ],
  },

  paymentProcessor: {
    inputs: [],
    name: 'PP_Simple_v1',
  },
} as const

export const expected_FM_BC_Restricted_BancorInputSchema = {
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
          description:
            'The decimals used within the issuance token ( should be bigger or equal to 7 and bigger or equel to the collateral token decimals )',
          jsType: 'numberString',
        },
        {
          name: 'maxSupply',
          type: 'uint256',
          description: 'The max total supply of the token',
          tags: ['decimals:params:exact:decimals'],
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
          name: 'initialIssuanceSupply',
          type: 'uint256',
          description: 'The initial virtual issuance token supply',
          jsType: 'numberString',
        },
        {
          name: 'initialCollateralSupply',
          type: 'uint256',
          description: 'The initial virtual collateral token supply',
          jsType: 'numberString',
        },
      ],
      name: 'bondingCurveParams',
      type: 'tuple',
    },
    {
      name: 'collateralToken',
      type: 'address',
      description:
        'The address of the token that will be deposited to the funding manager',
      jsType: '0xstring',
    },
  ],
} as const

export const expected_LM_PC_KPIRewarderInputSchema = {
  name: 'LM_PC_KPIRewarder_v1',
  inputs: [
    {
      name: 'stakingTokenAddr',
      type: 'address',
      description: 'The token users stake to earn rewards.',
      jsType: '0xstring',
    },
    {
      name: 'currencyAddr',
      type: 'address',
      description: 'The token the Optimistic Oracle will charge its fee in.',
      jsType: '0xstring',
    },
    {
      name: 'ooAddr',
      type: 'address',
      description: 'The address of the optimisitic oracle.',
      jsType: '0xstring',
    },
    {
      name: 'liveness',
      type: 'uint64',
      description:
        'How long (in seconds) a query to the oracle will be open for dispute.',
      jsType: 'numberString',
    },
  ],
} as const
