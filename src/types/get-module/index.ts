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
 * @template T - The module name or module data
 * @template W - The wallet client
 * @returns The parameters for the getModule function
 */
export type GetModuleParams<
  T extends ModuleName | ModuleData,
  W extends PopWalletClient | undefined = undefined,
> = T extends ModuleName
  ? {
      name: T
      moduleData?: never
      address: Hex
      publicClient: PopPublicClient
      walletClient?: W
      tagConfig?: TagConfig
      self?: Inverter<W>
    }
  : T extends ModuleData
    ? {
        name?: never
        moduleData: T
        address: Hex
        publicClient: PopPublicClient
        walletClient?: W
        tagConfig?: TagConfig
        self?: Inverter<W>
      }
    : never

type Data<T extends ModuleName | ModuleData> = T extends ModuleName
  ? GetModuleData<T>
  : T extends ModuleData
    ? T
    : never

/**
 * @description The return type for the getModule function
 * @template N - The module name
 * @template W - The wallet client
 * @template MD - Optional module data
 * @template R - Inferred data source (MD or GetModuleData<N>)
 * @returns The return type for the getModule function
 */
export type GetModuleReturnType<
  T extends ModuleName | ModuleData,
  W extends PopWalletClient | undefined = undefined,
> = {
  name: Data<T>['name']
  address: Hex
  moduleType: Data<T>['moduleType']
  description: Data<T>['description']
  read: GetModuleIterateMethodsReturnType<
    Data<T>['abi'],
    ['view', 'pure'],
    'read'
  >
  simulate: GetModuleIterateMethodsReturnType<
    Data<T>['abi'],
    ['nonpayable', 'payable'],
    'simulate'
  >
  estimateGas: GetModuleIterateMethodsReturnType<
    Data<T>['abi'],
    ['nonpayable', 'payable'],
    'estimateGas'
  >
  write: W extends undefined
    ? never
    : GetModuleIterateMethodsReturnType<
        Data<T>['abi'],
        ['nonpayable', 'payable'],
        'write'
      >
}

export * from './utils'
