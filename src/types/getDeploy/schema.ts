import type { ModuleName } from '@inverter-network/abis'
import type { OrchestratorInputs } from './generic'
import type { FomrattedDeploymentParameters } from './parameter'
import type { RequestedModules } from './requested'
import type { EmptyObjectToNever, OmitNever } from '../../'
import type { Simplify } from 'type-fest-4'

export type ModuleSchema<N extends ModuleName = ModuleName> = {
  name: N
  inputs: FomrattedDeploymentParameters<N>
}

export type OptionalModules<T extends RequestedModules['optionalModules']> =
  Simplify<
    T extends undefined
      ? never
      : {
          [K in keyof T]: ModuleSchema<
            // @ts-expect-error - TS cant resolve name
            T[K]
          >
        }
  >

export type DeploySchema<T extends RequestedModules = RequestedModules> =
  Simplify<
    OmitNever<{
      orchestrator: OrchestratorInputs
      paymentProcessor: ModuleSchema<T['paymentProcessor']>
      fundingManager: ModuleSchema<T['fundingManager']>
      authorizer: ModuleSchema<T['authorizer']>
      optionalModules: EmptyObjectToNever<OptionalModules<T['optionalModules']>>
    }>
  >
