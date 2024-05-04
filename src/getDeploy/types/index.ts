import {
  GetModuleData,
  GetModuleVersion,
  GetModuleNameByType,
  ModuleName,
} from '@inverter-network/abis'
import { OrchestratorArgs, ModuleParams, ModuleType } from './generic'

export type ConfigData<
  N extends ModuleName,
  V extends GetModuleVersion<N>,
> = GetModuleData<N, V>['deploymentArgs']['configData'][number]

export type ClientInputs = {
  Orchestrator: OrchestratorArgs
} & Partial<{
  [K in GetModuleNameByType<ModuleType>]: ParamsObject<K>
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
