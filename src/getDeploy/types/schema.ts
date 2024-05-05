import { GetModuleVersion, ModuleName, Pretty } from '@inverter-network/abis'
import { OrchestratorInputs } from './generic'
import { FomrattedDeploymentParameters } from './parameter'
import { RequestedModules } from './requested'
import { ExcludeNeverFields } from '../../types'

export type ModuleSchema<
  N extends ModuleName = ModuleName,
  V extends GetModuleVersion<N> = GetModuleVersion<N>,
> = {
  name: N
  version: V
  inputs: FomrattedDeploymentParameters<N, V>
}

export type OptionalModules<T extends RequestedModules['optionalModules']> =
  T extends infer U
    ? U extends RequestedModules['optionalModules']
      ? Pretty<{
          [K in keyof U]: ModuleSchema<
            // @ts-expect-error - TS cant resolve name
            U[K]['name'],
            // @ts-expect-error - TS cant resolve version
            U[K]['version']
          >
        }>
      : never
    : never

export type DeploySchema<T extends RequestedModules = RequestedModules> =
  Pretty<
    ExcludeNeverFields<{
      orchestrator: OrchestratorInputs
      paymentProcessor: ModuleSchema<
        T['paymentProcessor']['name'],
        // @ts-expect-error - TS cant resolve version
        T['paymentProcessor']['version']
      >
      fundingManager: ModuleSchema<
        T['fundingManager']['name'],
        // @ts-expect-error - TS cant resolve version
        T['fundingManager']['version']
      >
      authorizer: ModuleSchema<
        T['authorizer']['name'],
        // @ts-expect-error - TS cant resolve version
        T['authorizer']['version']
      >
      optionalModules: OptionalModules<T['optionalModules']>
    }>
  >
