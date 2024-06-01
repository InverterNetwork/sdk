// ===============CONSTANTS_START================

export const expectedBaseInputSchema = {
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
