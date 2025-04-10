// external dependencies
import type { GetModuleData, ModuleName } from '@inverter-network/abis'
import type { Hex } from 'viem'

// sdk types
import type { Inverter } from '@/inverter'
import type {
  GetModuleIterateMethodsReturnType,
  TagConfig,
  PopPublicClient,
  PopWalletClient,
  ModuleData,
} from '@/index'

/**
 * @description The parameters for the getModule function
 * @template N - The module name
 * @template W - The wallet client
 * @returns The parameters for the getModule function
 */
export type GetModuleParams<
  N extends MD extends ModuleData ? never : ModuleName,
  W extends PopWalletClient | undefined = undefined,
  MD extends ModuleData | undefined = undefined,
> = {
  address: Hex
  publicClient: PopPublicClient
  walletClient?: W
  tagConfig?: TagConfig
  moduleData?: MD
  self?: Inverter<W>
} & (MD extends undefined ? { name: N } : {})

/**
 * @description The return type for the getModule function
 * @template N - The module name
 * @template W - The wallet client
 * @template MD - Optional module data
 * @template R - Inferred data source (MD or GetModuleData<N>)
 * @returns The return type for the getModule function
 */
export type GetModuleReturnType<
  N extends MD extends ModuleData ? never : ModuleName,
  W extends PopWalletClient | undefined = undefined,
  MD extends ModuleData | undefined = undefined,
  R extends GetModuleData<N> | NonNullable<MD> = MD extends undefined
    ? GetModuleData<N>
    : NonNullable<MD>,
> = {
  name: R['name']
  address: Hex
  moduleType: R['moduleType']
  description: R['description']
  read: GetModuleIterateMethodsReturnType<R['abi'], ['view', 'pure'], 'read'>
  simulate: GetModuleIterateMethodsReturnType<
    R['abi'],
    ['nonpayable', 'payable'],
    'simulate'
  >
  estimateGas: GetModuleIterateMethodsReturnType<
    R['abi'],
    ['nonpayable', 'payable'],
    'estimateGas'
  >
  write: W extends undefined
    ? never
    : GetModuleIterateMethodsReturnType<
        R['abi'],
        ['nonpayable', 'payable'],
        'write'
      >
}

export * from './utils'
