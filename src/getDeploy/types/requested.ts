import {
  GetModuleNameByType,
  GetModuleVersion,
  Pretty,
} from '@inverter-network/abis'
import { MendatoryModuleType, ModuleType } from '.'

export type RequestedModule<
  MT extends ModuleType = ModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = {
  name: N
  version: GetModuleVersion<N>
}

export type RequestedModules = Pretty<
  {
    [K in MendatoryModuleType]: RequestedModule<K>
  } & {
    optionalModules?: RequestedModule<'logicModule' | 'utils'>[]
  }
>

export type RequestedMandatoryModule = RequestedModule<
  'paymentProcessor' | 'authorizer' | 'fundingManager'
>
