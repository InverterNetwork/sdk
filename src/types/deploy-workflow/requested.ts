// external dependencies
import type { GetModuleNameByType } from '@inverter-network/abis'
import type { Simplify } from 'type-fest-4'

// sdk types
import type { MendatoryModuleType, ModuleType, ModuleData } from '@/types'

/**
 * @description The requested module options for moduleType and moduleName
 * @template MT - The module type
 * @template N - The module name
 * @returns The requested module option
 */
export type RequestedModule<
  MT extends ModuleType = ModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = N

/**
 * @description The requested mandatory module options for deployment
 * @returns The requested mandatory module option
 */
export type RequestedMandatoryModule = RequestedModule<
  'paymentProcessor' | 'authorizer' | 'fundingManager'
>

/**
 * @description The requested modules options for deployment
 * @template FT - The factory type
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
