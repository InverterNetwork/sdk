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
 * @template TModuleName - The module name
 * @template TWalletClient - The wallet client
 * @template TModuleData - The module data
 * @returns The parameters for the getModule function
 */
export type GetModuleParams<
  TModuleName extends TModuleData extends ModuleData ? never : ModuleName,
  TWalletClient extends PopWalletClient | undefined = undefined,
  TModuleData extends ModuleData | undefined = undefined,
> = {
  address: Hex
  publicClient: PopPublicClient
  walletClient?: TWalletClient
  tagConfig?: TagConfig
  moduleData?: TModuleData
  self?: Inverter<TWalletClient>
} & (TModuleData extends undefined ? { name: TModuleName } : {})

/**
 * @description The return type for the getModule function
 * @template TModuleName - The module name
 * @template TWalletClient - The wallet client
 * @template TModuleData - Optional module data
 * @returns The return type for the getModule function
 */
export type GetModuleReturnType<
  TModuleName extends TModuleData extends ModuleData ? never : ModuleName,
  TWalletClient extends PopWalletClient | undefined = undefined,
  TModuleData extends ModuleData | undefined = undefined,
  R extends
    | GetModuleData<TModuleName>
    | NonNullable<TModuleData> = TModuleData extends undefined
    ? GetModuleData<TModuleName>
    : NonNullable<TModuleData>,
> = {
  abi: R['abi']
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
  bytecode: GetModuleIterateMethodsReturnType<
    R['abi'],
    ['nonpayable', 'payable', 'pure', 'view'],
    'write'
  >
  write: TWalletClient extends undefined
    ? never
    : GetModuleIterateMethodsReturnType<
        R['abi'],
        ['nonpayable', 'payable'],
        'write'
      >
}

export * from './utils'
