import { getModuleData } from '@inverter-network/abis'
import { formatUnits } from 'viem'

// Uint Max Supply
export const UINT_MAX_SUPPLY =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

// Formatted Uint Max Supply
export const GET_HUMAN_READABLE_UINT_MAX_SUPPLY = (decimals: number) =>
  formatUnits(UINT_MAX_SUPPLY, decimals)

export const FM_BASE = [
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getIssuanceToken',
    outputs: [{ internalType: 'address', name: '_0', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
]

export const ERC20_ABI = getModuleData('ERC20').abi

export const ERC20_MINTABLE_ABI = [
  ...ERC20_ABI,
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const writeOutputs = [
  {
    name: 'txHash',
    type: 'bytes32',
  },
] as const

export const estimateGasOutputs = [
  {
    name: 'gas',
    type: 'tuple',
    components: [
      {
        name: 'value',
        type: 'uint256',
      },
      {
        name: 'formatted',
        type: 'uint256',
      },
    ],
  },
] as const
