export const ORCHESTRATOR_CONFIG = {
    name: 'Orchestrator',
    version: 'v1.0',
    params: [
      {
        name: 'owner',
        type: 'address',
        jsType: 'string',
        description: 'The owner address of the workflow',
        value: '',
      },
      {
        name: 'token',
        type: 'address',
        jsType: 'string',
        description: 'The payment token associated with the workflow',
        value: '',
      },
    ],
  },
  MANDATORY_MODULES = 3,
  OPTIONAL_MODULES_IDX = 4,
  EMPTY_ENCODED_VAL = '0x',
  ORCHESTRATOR_FACTORY_ADDRESS = '0x690d5000D278f90B167354975d019c747B78032e',
  METADATA_URL = 'https://github.com/InverterNetwork'
