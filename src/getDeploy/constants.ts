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
  DEPLOYMENTS_URL =
    'https://raw.githubusercontent.com/InverterNetwork/deployments/main/deployments.json' as const,
  METADATA_URL = 'https://github.com/InverterNetwork/inverter-contracts',
  USDC_SEPOLIA = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
