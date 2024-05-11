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
            T[K]['name']
          >
        }
  >

export type DeploySchema<T extends RequestedModules = RequestedModules> =
  Simplify<
    OmitNever<{
      orchestrator: OrchestratorInputs
      paymentProcessor: ModuleSchema<T['paymentProcessor']['name']>
      fundingManager: ModuleSchema<T['fundingManager']['name']>
      authorizer: ModuleSchema<T['authorizer']['name']>
      optionalModules: OptionalModules<T['optionalModules']>
    }>
  >
