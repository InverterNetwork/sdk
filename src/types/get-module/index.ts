import { Inverter } from '@/inverter'

import type { GetModuleData, ModuleName } from '@inverter-network/abis'
import type { Hex } from 'viem'
import type { Extras, PopPublicClient, PopWalletClient } from '@/types'
import type { GetModuleIterateMethodsReturnType } from '@'

export type GetModuleParams<
  N extends ModuleName,
  W extends PopWalletClient | undefined = undefined,
> = {
  name: N
  address: Hex
  publicClient: PopPublicClient
  walletClient?: W
  extras?: Extras
  self?: Inverter<W>
}

export type GetModuleReturn<
  N extends ModuleName,
  W extends PopWalletClient | undefined = undefined,
> = {
  name: N
  address: Hex
  moduleType: GetModuleData<N>['moduleType']
  description: GetModuleData<N>['description']
  read: GetModuleIterateMethodsReturnType<
    GetModuleData<N>['abi'],
    ['view', 'pure'],
    'read'
  >
  simulate: GetModuleIterateMethodsReturnType<
    GetModuleData<N>['abi'],
    ['nonpayable', 'payable'],
    'simulate'
  >
  estimateGas: GetModuleIterateMethodsReturnType<
    GetModuleData<N>['abi'],
    ['nonpayable', 'payable'],
    'estimateGas'
  >
  write: W extends undefined
    ? never
    : GetModuleIterateMethodsReturnType<
        GetModuleData<N>['abi'],
        ['nonpayable', 'payable'],
        'write'
      >
}

export * from './utils'
