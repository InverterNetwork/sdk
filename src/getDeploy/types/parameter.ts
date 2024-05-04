import { ModuleName, GetModuleVersion } from '@inverter-network/abis'
import { GetDeploymentArgs } from '.'

export type ConfigDataParameters<
  N extends ModuleName,
  V extends GetModuleVersion<N>,
> = {
  [K in GetDeploymentArgs<N, V>['configData'][number]['name']]: Extract<
    GetDeploymentArgs<N, V>['configData'][number],
    {
      name: K
    }
  >
}
