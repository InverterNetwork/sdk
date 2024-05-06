import { GetModuleNameByType, GetModuleVersion } from '@inverter-network/abis'
import { MendatoryModuleType, ModuleType } from '.'
import { Simplify } from 'type-fest'

export type RequestedModule<
  MT extends ModuleType = ModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = {
  name: N
  version: GetModuleVersion<N>
}

export type RequestedModules = Simplify<
  {
    [K in MendatoryModuleType]: RequestedModule<K>
  } & {
    optionalModules?: RequestedModule<'logicModule' | 'utils'>[]
  }
>

export type RequestedMandatoryModule = RequestedModule<
  'paymentProcessor' | 'authorizer' | 'fundingManager'
>
