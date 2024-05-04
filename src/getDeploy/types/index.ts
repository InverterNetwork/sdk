import {
  GetModuleData,
  GetModuleVersion,
  GetModuleNameByType,
  ModuleName,
} from '@inverter-network/abis'
import { OrchestratorArgs, ModuleParams, ModuleType } from './generic'

export type GetDeploymentArgs<
  N extends ModuleName = ModuleName,
  V extends GetModuleVersion<N> = GetModuleVersion<N>,
> = GetModuleData<N, V>['deploymentArgs']

export type ClientInputs = {
  Orchestrator: OrchestratorArgs
} & Partial<{
  [K in GetModuleNameByType<ModuleType>]: any
}>

export type FinalArgs = {
  orchestrator: OrchestratorArgs
  fundingManager: ModuleParams
  authorizer: ModuleParams
  paymentProcessor: ModuleParams
  optionalModules: ModuleParams[]
}

export * from './generic'
export * from './requested'
export * from './parameter'
export * from './schema'
