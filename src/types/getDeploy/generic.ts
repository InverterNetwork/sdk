import type {
  GetModuleNameByType,
  UserFacingModuleType,
} from '@inverter-network/abis'
import {
  ORCHESTRATOR_CONFIG,
  PIM_ISSUANCE_TOKEN_CONFIG,
} from '../../getDeploy/constants'

export type FactoryType = 'default' | 'restricted-pim'

// Module Types Start
export type ModuleType = Exclude<UserFacingModuleType, 'orchestrator'>
export type MendatoryModuleType =
  | 'fundingManager'
  | 'paymentProcessor'
  | 'authorizer'
// Module Types End

export type OrchestratorInputs = typeof ORCHESTRATOR_CONFIG

export type PIMIssuanceTokenInputs = typeof PIM_ISSUANCE_TOKEN_CONFIG

export type ModuleNameByType = GetModuleNameByType<ModuleType>
