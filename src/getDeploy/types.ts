import {
  UserFacingModuleType,
  ModuleVersion,
  ModuleVersionKey,
} from '@inverter-network/abis'
import { AbiType } from 'abitype'
import { ORCHESTRATOR_CONFIG } from './constants'
import { Pretty } from '../types'

export type ModuleType = Exclude<UserFacingModuleType, 'orchestrator'>

export type NameByModuleType<T extends ModuleType> = Extract<
  ModuleVersion,
  { moduleType: T }
>['name']

export type ModuleInputs<T extends ModuleType> = {
  name: NameByModuleType<T>
  version: ModuleVersionKey
  params: Params[]
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

export type ModuleSpec = {
  name: Pretty<
    | NameByModuleType<'fundingManager'>
    | NameByModuleType<'authorizer'>
    | NameByModuleType<'paymentProcessor'>
    | NameByModuleType<'logicModule'>
  >
  version: ModuleVersionKey
}

export type Params = {
  name: string
  type: AbiType
  description: string
  value: string
}

export type ModuleSchema = {
  name: string
  version: string
  params: Params[]
}

// ==================================================================
// Arguments section not present in the original code

export type OrchestratorArg = {
  ownerAddress: `0x${string}`
  tokenAddress: `0x${string}`
}

export type ModuleArg<T extends ModuleType> = {
  name: NameByModuleType<T>
  version: ModuleVersionKey
  params: {
    name: string
    value: any
  }[]
}

export type DeployArguments = {
  orchestrator: OrchestratorArg
  fundingManager: ModuleArg<'fundingManager'>
  authorizer: ModuleArg<'authorizer'>
  paymentProcessor: ModuleArg<'paymentProcessor'>
  logicModules?: {
    name: NameByModuleType<'logicModule'>
    params: ModuleArg<'logicModule'>
  }[]
}
