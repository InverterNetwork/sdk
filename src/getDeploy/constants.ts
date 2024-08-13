export const ORCHESTRATOR_CONFIG = {
    name: 'Orchestrator_v1',
    inputs: [
      {
        name: 'independentUpdates',
        type: 'bool',
        jsType: 'boolean',
        description:
          'Default is false - Whether this workflow’s updates to Orchestrator and Modules shall be self-governed.',
      },
      {
        name: 'independentUpdateAdmin',
        type: 'address',
        jsType: '0xstring',
        description:
          'Should only be set if independentUpdates is true  - The address that will be responsible for updates to Orchestrator and Modules of the workflow.',
      },
    ],
  } as const,
  PIM_ISSUANCE_TOKEN_CONFIG = {
    name: 'Restricted_PIM_Factory_v1',
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
            jsType: 'numberString',
            description:
              'The decimals used within the issuance token ( should be bigger or equal to 7 and bigger or equel to the collateral token decimals )',
          },
          {
            name: 'maxSupply',
            type: 'uint256',
            jsType: 'numberString',
            description: 'The max total supply of the token',
            tags: ['decimals:params:exact:decimals'],
          },
        ],
        name: 'issuanceToken',
        type: 'tuple',
      },
    ],
  } as const,
  MANDATORY_MODULES = [
    'authorizer',
    'paymentProcessor',
    'fundingManager',
  ] as const,
  DEPLOYMENTS_URL =
    'https://raw.githubusercontent.com/InverterNetwork/deployments/main/deployments.json' as const,
  METADATA_URL = 'https://github.com/InverterNetwork/inverter-contracts',
  USDC_SEPOLIA = '0x5fd84259d66Cd46123540766Be93DFE6D43130D7'
