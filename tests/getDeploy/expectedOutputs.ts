import { ORCHESTRATOR_CONFIG } from '../../src/getDeploy/constants'

export const expectedBaseInputSchema = {
  orchestrator: ORCHESTRATOR_CONFIG,

  fundingManager: {
    name: 'FM_DepositVault_v1',
    inputs: [
      {
        name: 'orchestratorTokenAddress',
        type: 'address',
        jsType: '0xstring',
        description: 'The distribution token of the funding manager',
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
      name: 'issuanceToken',
      type: 'address',
      description: 'The address of the token that will be issued',
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
          tags: ['decimals:params:indirect:issuanceToken'],
          jsType: 'numberString',
        },
        {
          name: 'initialCollateralSupply',
          type: 'uint256',
          description: 'The initial virtual collateral token supply',
          tags: ['decimals:params:indirect:collateralToken'],
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
      name: 'defaultBond',
      type: 'uint256',
      description: 'The default bond amount for assertions.',
      jsType: 'numberString',
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
