import type { ModuleName } from '@inverter-network/abis'
import type { FormatParameters, GetDeploymentInputs } from '../..'

export type ConfigDataParameters<N extends ModuleName> = {
  [K in GetDeploymentInputs<N>['configData'][number]['name']]: Extract<
    GetDeploymentInputs<N>['configData'][number],
    {
      name: K
    }
  >
}

export type FomrattedDeploymentParameters<N extends ModuleName> =
  FormatParameters<GetDeploymentInputs<N>['configData']>
