import { GetModuleNameByType } from '@inverter-network/abis'
import { MendatoryModuleType, ModuleType } from '.'
import { Simplify } from 'type-fest-4'

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