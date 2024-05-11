import { ModuleName } from '@inverter-network/abis'
import { OrchestratorInputs } from './generic'
import { FomrattedDeploymentParameters } from './parameter'
import { RequestedModules } from './requested'
import { OmitNever } from '../../types'
import { Simplify } from 'type-fest'

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
      optionalModules: OptionalModules<T['optionalModules']>
    }>
  >
