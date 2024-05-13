export const ORCHESTRATOR_CONFIG = {
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
  } as const,
  MANDATORY_MODULES = [
    'authorizer',
    'paymentProcessor',
    'fundingManager',
  ] as const,
  ORCHESTRATOR_FACTORY_ADDRESS =
    '0xa6efB8332A0Cee2e8cD43edbfeb89c1376c20Ee5' as const,
  METADATA_URL = 'https://github.com/InverterNetwork/inverter-contracts'
