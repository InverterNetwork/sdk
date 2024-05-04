import {
  GetModuleNameByType,
  UserFacingModuleType,
} from '@inverter-network/abis'
import { RequestedModule } from '.'
import { ORCHESTRATOR_CONFIG } from '../constants'

// Module Types Start
export type ModuleType = Exclude<UserFacingModuleType, 'orchestrator'> | 'utils'
export type RequestedMandatoryModule = RequestedModule<
  'paymentProcessor' | 'authorizer' | 'fundingManager'
>
export type MendatoryModuleType =
  | 'fundingManager'
  | 'paymentProcessor'
  | 'authorizer'
// Module Types End

export type OrchestratorInputs = typeof ORCHESTRATOR_CONFIG

export type ModuleNameByType = GetModuleNameByType<ModuleType>

export type EncodedParams = {
  configData: `0x${string}`
  dependencyData: `0x${string}`
}

export type OrchestratorArgs = {
  owner: `0x${string}`
  token: `0x${string}`
}

export type Metadata = {
  majorVersion: bigint
  minorVersion: bigint
  url: string
  title: string
}

export type ModuleArgs = {
  metadata: Metadata
  configData: `0x${string}`
  dependencyData: `0x${string}`
}

export type ModuleParams = {
  metadata: Metadata
  configData: `0x${string}`
  dependencyData: `0x${string}`
}
