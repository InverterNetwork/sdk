import type { GetModuleNameByType } from '@inverter-network/abis'
import type { FactoryType, MendatoryModuleType, ModuleType } from '.'
import type { Simplify } from 'type-fest-4'
import type { FilterByPrefix } from '../utils'

export type RequestedModule<
  MT extends ModuleType = ModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = N

export type RequestedModules<FT extends FactoryType = 'default'> = Simplify<
  {
    [K in MendatoryModuleType]: K extends 'fundingManager'
      ? FT extends 'default'
        ? RequestedModule<K>
        : FilterByPrefix<GetModuleNameByType<'fundingManager'>, 'FM_BC'>
      : RequestedModule<K>
  } & {
    optionalModules?: RequestedModule<'optionalModule'>[]
  }
>

export type RequestedMandatoryModule = RequestedModule<
  'paymentProcessor' | 'authorizer' | 'fundingManager'
>
