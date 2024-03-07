export default [
  {
    type: 'function',
    name: 'token',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transferOrchestratorToken',
    inputs: [
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      {
        name: '_from',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: '_for',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: '_amount',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TransferOrchestratorToken',
    inputs: [
      {
        name: '_to',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: '_amount',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Withdrawal',
    inputs: [
      {
        name: '_from',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: '_for',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: '_amount',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'Module__FundingManager__CannotSelfDeposit',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Module__FundingManager__DepositCapReached',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Module__FundingManager__InvalidAddress',
    inputs: [],
  },
] as const
