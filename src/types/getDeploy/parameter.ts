import type { ModuleName } from '@inverter-network/abis'
import type { GetDeploymentInputs } from '@/types'

export type GetDeploymentParameters<N extends ModuleName> =
  GetDeploymentInputs<N>['configData']
