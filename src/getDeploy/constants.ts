export const ORCHESTRATOR_CONFIG = {
    name: 'Orchestrator',
    version: '1',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        description: 'The owner address of the workflow',
      },
      {
        name: 'token',
        type: 'address',
        description: 'The payment token associated with the workflow',
      },
    ],
  } as const,
  MANDATORY_MODULES = [
    'authorizer',
    'paymentProcessor',
    'fundingManager',
  ] as const,
  ORCHESTRATOR_FACTORY_ADDRESS =
    '0x690d5000D278f90B167354975d019c747B78032e' as const,
  METADATA_URL = 'https://github.com/InverterNetwork',
  DECIMALS_ABI = [
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ]
