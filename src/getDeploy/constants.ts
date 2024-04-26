export const ORCHESTRATOR_CONFIG = {
    name: 'Orchestrator',
    version: 'v1.0',
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
  MANDATORY_MODULES = ['authorizer', 'paymentProcessor', 'fundingManager'],
  ORCHESTRATOR_FACTORY_ADDRESS = '0x690d5000D278f90B167354975d019c747B78032e',
  METADATA_URL = 'https://github.com/InverterNetwork'
