import { ModuleName } from '@inverter-network/abis'
import { OrchestratorInputs } from './generic'
import { FomrattedDeploymentParameters } from './parameter'
import { RequestedModules } from './requested'
import { OmitNever } from '../../types'
import { Simplify } from 'type-fest'

export type ModuleSchema<
  N extends ModuleName = ModuleName,
  V extends string = string,
> = {
  name: N
  version: V
  inputs: FomrattedDeploymentParameters<N, V>
}

export type OptionalModules<T extends RequestedModules['optionalModules']> =
  T extends undefined
    ? never
    : Simplify<{
        [K in keyof T]: ModuleSchema<
          // @ts-expect-error - TS cant resolve name
          T[K]['name'],
          // @ts-expect-error - TS cant resolve version
          T[K]['version']
        >
      }>

export type DeploySchema<T extends RequestedModules = RequestedModules> =
  Simplify<
    OmitNever<{
      orchestrator: OrchestratorInputs
      paymentProcessor: ModuleSchema<
        T['paymentProcessor']['name'],
        T['paymentProcessor']['version']
      >
      fundingManager: ModuleSchema<
        T['fundingManager']['name'],
        T['fundingManager']['version']
      >
      authorizer: ModuleSchema<
        T['authorizer']['name'],
        T['authorizer']['version']
      >
      optionalModules: OptionalModules<T['optionalModules']>
    }>
  >
