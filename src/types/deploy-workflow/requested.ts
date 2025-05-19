// external dependencies
import type { GetModuleNameByType } from '@inverter-network/abis'
// sdk types
import type { MendatoryModuleType, ModuleData, ModuleType } from '@/types'
import type { Simplify } from 'type-fest-4'

/**
 * @description The requested module options for moduleType and moduleName
 * @template TModuleType - The module type
 * @template TModuleName - The module name
 * @returns The requested module option
 */
export type RequestedModule<
  TModuleType extends ModuleType = ModuleType,
  TModuleName extends
    GetModuleNameByType<TModuleType> = GetModuleNameByType<TModuleType>,
> = TModuleName

/**
 * @description The requested mandatory module options for deployment
 * @returns The requested mandatory module option
 */
export type RequestedMandatoryModule = RequestedModule<
  'paymentProcessor' | 'authorizer' | 'fundingManager'
>

/**
 * @description The requested modules options for deployment
 * @returns The requested modules options
 */
export type RequestedModules = Simplify<
  {
    [K in MendatoryModuleType]: RequestedModule<K>
  } & {
    optionalModules?: RequestedModule<'optionalModule'>[]
  }
>

/**
 * @description The requested modules with optional ABI parameters
 */
export type MixedRequestedModules = {
  [K in MendatoryModuleType]: RequestedModule<K> | ModuleData<K>
} & {
  optionalModules?: (
    | RequestedModule<'optionalModule'>
    | ModuleData<'optionalModule'>
  )[]
}
