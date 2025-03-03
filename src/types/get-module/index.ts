// external dependencies
import type { GetModuleData, ModuleName } from '@inverter-network/abis'
import type { Hex } from 'viem'

// sdk types
import type { Inverter } from '@/inverter'
import type {
  GetModuleIterateMethodsReturnType,
  Extras,
  PopPublicClient,
  PopWalletClient,
} from '@/index'

/**
 * @description The parameters for the getModule function
 * @template N - The module name
 * @template W - The wallet client
 * @returns The parameters for the getModule function
 */
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

/**
 * @description The return type for the getModule function
 * @template N - The module name
 * @template W - The wallet client
 * @returns The return type for the getModule function
 */
export type GetModuleReturnType<
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
