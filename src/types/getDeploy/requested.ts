import type { GetModuleNameByType } from '@inverter-network/abis'
import type { MendatoryModuleType, ModuleType } from '.'
import type { Simplify } from 'type-fest-4'

export type RequestedModule<
  MT extends ModuleType = ModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = N

export type RequestedModules = Simplify<
  {
    [K in MendatoryModuleType]: RequestedModule<K>
  } & {
    optionalModules?: RequestedModule<'optionalModule'>[]
  }
>

export type RequestedMandatoryModule = RequestedModule<
  'paymentProcessor' | 'authorizer' | 'fundingManager'
>
