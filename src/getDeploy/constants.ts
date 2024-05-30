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
    '0x763003802b22c3f2B9106768497ca43088958c9C' as const,
  METADATA_URL = 'https://github.com/InverterNetwork/inverter-contracts'
