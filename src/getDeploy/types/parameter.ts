import { ModuleName, GetModuleVersion } from '@inverter-network/abis'
import { ConfigData } from '.'

export type ConfigDataParameters<
  N extends ModuleName,
  V extends GetModuleVersion<N>,
> = {
  [K in ConfigData<N, V>['name']]: Extract<
    ConfigData<N, V>,
    {
      name: K
    }
  >
}
