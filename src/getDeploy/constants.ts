export const ORCHESTRATOR_CONFIG = {
    name: 'Orchestrator',
    version: 'v1.0',
    params: {
      owner: {
        type: 'address',
        jsType: 'string',
        description: 'The owner address of the workflow',
      },
      token: {
        type: 'address',
        jsType: 'string',
        description: 'The payment token associated with the workflow',
      },
    },
  },
  MANDATORY_MODULES = 3,
  OPTIONAL_MODULES_IDX = 4,
  EMPTY_ENCODED_VAL = '0x',
  ORCHESTRATOR_FACTORY_ADDRESS = '0x690d5000D278f90B167354975d019c747B78032e',
  METADATA_URL = 'https://github.com/InverterNetwork',
  ARGS_TEMPLATE = {
    orchestrator: {
      token: null,
      owner: null,
    },
    authorizer: {
      metadata: null,
      configData: EMPTY_ENCODED_VAL,
      dependencyData: EMPTY_ENCODED_VAL,
    },
    fundingManager: {
      metadata: null,
      configData: EMPTY_ENCODED_VAL,
      dependencyData: EMPTY_ENCODED_VAL,
    },
    paymentProcessor: {
      metadata: null,
      configData: EMPTY_ENCODED_VAL,
      dependencyData: EMPTY_ENCODED_VAL,
    },
    optionalModules: [],
  }
