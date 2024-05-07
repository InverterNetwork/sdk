import { ModuleName, GetModuleVersion } from '@inverter-network/abis'
import { FormatParameters, GetDeploymentArgs } from '../../types'

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

export type FomrattedDeploymentParameters<
  N extends ModuleName,
  V extends string,
> = FormatParameters<
  [
    ...GetDeploymentArgs<N, V>['configData'],
    ...GetDeploymentArgs<N, V>['dependencyData'],
  ]
>
