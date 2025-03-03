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

/**
 * @description The return type for the fetchDeployment function
 */
export type FetchDeploymentReturnType = {
  bancorFormula: Record<string, `0x${string}` | undefined>
  erc20Mock: Record<string, `0x${string}` | undefined>
  orchestratorFactory: Record<string, `0x${string}` | undefined>
  restrictedPimFactory: Record<string, `0x${string}` | undefined>
  immutablePimFactory: Record<string, `0x${string}` | undefined>
  migratingPimFactory: Record<string, `0x${string}` | undefined>
}

/**
 * @description The version of the deployment
 */
export type DeploymentVersion = 'v1.0.0'
