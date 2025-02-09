import type {
  GetModuleNameByType,
  UserFacingModuleType,
} from '@inverter-network/abis'

export type FactoryType = 'default' | 'restricted-pim' | 'immutable-pim'

// Module Types Start
export type ModuleType = Exclude<UserFacingModuleType, 'orchestrator'>
export type MendatoryModuleType =
  | 'fundingManager'
  | 'paymentProcessor'
  | 'authorizer'
// Module Types End

export type ModuleNameByType = GetModuleNameByType<ModuleType>
