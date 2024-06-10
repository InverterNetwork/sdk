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
  MANDATORY_MODULES = [
    'authorizer',
    'paymentProcessor',
    'fundingManager',
  ] as const,
  DEPLOYMENTS_URL =
    'https://raw.githubusercontent.com/InverterNetwork/deployments/main/deployments.json' as const,
  METADATA_URL = 'https://github.com/InverterNetwork/inverter-contracts',
  USDC_SEPOLIA = '0x5fd84259d66Cd46123540766Be93DFE6D43130D7'
