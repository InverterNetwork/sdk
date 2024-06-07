export const ORCHESTRATOR_CONFIG = {
    name: 'Orchestrator_v1',
    inputs: [
      {
        name: 'independentUpdates',
        type: 'bool',
        jsType: 'bool',
        description:
          'If set to false the workflow can be paused and upgraded by Inverter. If set to true only an admin determined by the user can manually upgrade the contracts (no pausing possible).',
      },
      {
        name: 'independentUpdateAdmin',
        type: 'address',
        jsType: '0xstring',
        description:
          'If `independentUpdates` is set to true, determines who can upgrade a workflow.',
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
