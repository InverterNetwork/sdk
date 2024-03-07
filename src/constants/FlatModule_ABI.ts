export default [
  {
    type: 'function',
    name: 'decoder',
    inputs: [{ name: 'data', type: 'bytes', internalType: 'bytes' }],
    outputs: [{ name: 'requirement', type: 'bool', internalType: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'grantModuleRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'addr', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'identifier',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'init',
    inputs: [
      {
        name: 'orchestrator_',
        type: 'address',
        internalType: 'contract IOrchestrator',
      },
      {
        name: 'metadata',
        type: 'tuple',
        internalType: 'struct IModule.Metadata',
        components: [
          {
            name: 'majorVersion',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'minorVersion',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'url', type: 'string', internalType: 'string' },
          { name: 'title', type: 'string', internalType: 'string' },
        ],
      },
      { name: '', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'init2',
    inputs: [
      {
        name: 'orchestrator_',
        type: 'address',
        internalType: 'contract IOrchestrator',
      },
      { name: 'dependencyData', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'orchestrator',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IOrchestrator',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'revokeModuleRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'addr', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [{ name: 'interfaceId', type: 'bytes4', internalType: 'bytes4' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'title',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'url',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'version',
    inputs: [],
    outputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint8',
        indexed: false,
        internalType: 'uint8',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ModuleInitialized',
    inputs: [
      {
        name: 'parentOrchestrator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'moduleTitle',
        type: 'string',
        indexed: true,
        internalType: 'string',
      },
      {
        name: 'majorVersion',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'minorVersion',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'Module_OrchestratorCallbackFailed',
    inputs: [{ name: 'funcSig', type: 'string', internalType: 'string' }],
  },
  {
    type: 'error',
    name: 'Module__CallerNotAuthorized',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'caller', type: 'address', internalType: 'address' },
    ],
  },
  { type: 'error', name: 'Module__CannotCallInit2Again', inputs: [] },
  { type: 'error', name: 'Module__InvalidMetadata', inputs: [] },
  {
    type: 'error',
    name: 'Module__InvalidOrchestratorAddress',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Module__NoDependencyOrMalformedDependencyData',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Module__OnlyCallableByOrchestrator',
    inputs: [],
  },
] as const
