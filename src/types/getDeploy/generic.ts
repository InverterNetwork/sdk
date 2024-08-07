import type {
  GetModuleNameByType,
  UserFacingModuleType,
} from '@inverter-network/abis'
import { ORCHESTRATOR_CONFIG } from '../../getDeploy/constants'

// Module Types Start
export type ModuleType = Exclude<UserFacingModuleType, 'orchestrator'>
export type MendatoryModuleType =
  | 'fundingManager'
  | 'paymentProcessor'
  | 'authorizer'
// Module Types End

export type OrchestratorInputs = typeof ORCHESTRATOR_CONFIG

export type ModuleNameByType = GetModuleNameByType<ModuleType>
