import { getModuleData } from '@inverter-network/abis'
import type { Abi } from 'abitype'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const FM_BASE: Abi = [
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

export const ERC20_ABI: Abi = getModuleData('ERC20').abi

export const ERC20_MINTABLE_ABI: Abi = [
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
