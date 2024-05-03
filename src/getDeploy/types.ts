import {
  UserFacingModuleType,
  ModuleVersion,
  ModuleVersionKey,
  data,
  Pretty,
} from '@inverter-network/abis'
import { AbiType } from 'abitype'
import { ORCHESTRATOR_CONFIG } from './constants'
import { FormattedAbiParameter } from '../types'

type ParamNames<T extends keyof typeof data> =
  (typeof data)[T]['v1.0']['deploymentArgs']['configData'][number]['name']

type ParamsObject<T extends keyof typeof data> = {
  [K in ParamNames<T>]: string | number | string[]
}

type ModuleNamesByType<T extends string> = {
  [K in keyof typeof data]: (typeof data)[K]['v1.0']['moduleType'] extends T
    ? (typeof data)[K]['v1.0']['name']
    : never
}[keyof typeof data]

type GetRequestedModule<T extends ModuleType | 'utils'> = {
  name: ModuleNamesByType<T>
  version: string // TODO: ModuleType specific version union
}

type Params = {
  name: string
  type: AbiType
  description: string
  value: string
}

type Metadata = {
  majorVersion: bigint
  minorVersion: bigint
  url: string
  title: string
}

export type ModuleType = Exclude<UserFacingModuleType, 'orchestrator'>
export type MandatoryModuleType = Exclude<
  UserFacingModuleType,
  'orchestrator' | 'logicModule' | 'utils'
>

export type NameByModuleType<T extends ModuleType> = Extract<
  ModuleVersion,
  { moduleType: T }
>['name']

export type ModuleInputs<T extends ModuleType> = {
  name: NameByModuleType<T>
  version: ModuleVersionKey
  inputs: Params[]
}

export type GenericModuleName = NameByModuleType<ModuleType>

export type GenericModuleInputs = ModuleInputs<ModuleType>

export type OrchestratorInputs = typeof ORCHESTRATOR_CONFIG

export type UserInputs = [
  OrchestratorInputs,
  ModuleInputs<'fundingManager'>,
  ModuleInputs<'authorizer'>,
  ModuleInputs<'paymentProcessor'>,
  ModuleInputs<'logicModule'>[],
]

export type RequestedModule = {
  name: Pretty<
    | NameByModuleType<'fundingManager'>
    | NameByModuleType<'authorizer'>
    | NameByModuleType<'paymentProcessor'>
    | NameByModuleType<'logicModule'>
  >
  version: ModuleVersionKey
}

export type RequestedModules = {
  paymentProcessor: GetRequestedModule<'paymentProcessor'>
  fundingManager: GetRequestedModule<'fundingManager'>
  authorizer: GetRequestedModule<'authorizer'>
  optionalModules?: GetRequestedModule<'logicModule' | 'utils'>[]
}

export type GenericRequestedMandatoryModule =
  | GetRequestedModule<'paymentProcessor'>
  | GetRequestedModule<'fundingManager'>
  | GetRequestedModule<'authorizer'>

// Util to construct params of getDeployFunction

export type ModuleSchema = {
  name: string
  version: string
  inputs: FormattedAbiParameter[]
}

export type DeploySchema = {
  orchestrator: ModuleSchema
  paymentProcessor: ModuleSchema
  fundingManager: ModuleSchema
  authorizer: ModuleSchema
  optionalModules?: ModuleSchema[]
}

export type OrchestratorArg = {
  owner: `0x${string}`
  token: `0x${string}`
}

export type ClientInputs = {
  Orchestrator: OrchestratorArg
} & Partial<{
  [K in
    | ModuleNamesByType<'authorizer'>
    | ModuleNamesByType<'paymentProcessor'>
    | ModuleNamesByType<'fundingManager'>
    | ModuleNamesByType<'utils'>
    | ModuleNamesByType<'logicModule'>]: ParamsObject<K>
}>

export type GenericModuleParams = {
  metadata: Metadata
  configData: `0x${string}`
  dependencyData: `0x${string}`
}

export type EncodedParams = {
  configData: `0x${string}`
  dependencyData: `0x${string}`
}

export type FinalArgs = {
  orchestrator: OrchestratorArg
  fundingManager: GenericModuleParams
  authorizer: GenericModuleParams
  paymentProcessor: GenericModuleParams
  optionalModules: GenericModuleParams[]
}
