import { GetModuleNameByType, GetModuleVersion } from '@inverter-network/abis'
import { ModuleType } from '.'

export type RequestedModule<
  MT extends ModuleType = ModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = {
  name: N
  version: GetModuleVersion<N>
}

export type RequestedModules = {
  [K in
    | 'paymentProcessor'
    | 'fundingManager'
    | 'authorizer']: RequestedModule<K>
} & {
  optionalModules?: RequestedModule<'logicModule' | 'utils'>[]
}
