import { ModuleName } from '@inverter-network/abis'
import { FormatParameters, GetDeploymentInputs } from '../../types'

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
