import type {
  GetModuleNameByType,
  UserFacingModuleType,
} from '@inverter-network/abis'

/**
 * @description Factory types for the deployment
 */
export type FactoryType =
  | 'default'
  | 'restricted-pim'
  | 'immutable-pim'
  | 'migrating-pim'

/**
 * @description Module types for the deployment
 */
export type ModuleType = Exclude<UserFacingModuleType, 'orchestrator'>

/**
 * @description Mendatory module types for the deployment
 */
export type MendatoryModuleType =
  | 'fundingManager'
  | 'paymentProcessor'
  | 'authorizer'
// Module Types End

/**
 * @description Module name by module type for the deployment
 */
export type ModuleNameByType = GetModuleNameByType<ModuleType>
