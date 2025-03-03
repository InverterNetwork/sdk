import type { GetDeployWorkflowModuleArg } from '@/index'

/**
 * @description Static metadata type for the deployment
 */
export type Metadata = {
  majorVersion: bigint
  minorVersion: bigint
  url: string
  title: string
}

/**
 * @description Encoded arguments type for the deployment
 */
export type EncodedArgs = {
  configData: `0x${string}`
}

/**
 * @description Orchestrator arguments type for the deployment
 */
export type OrchestratorArgs =
  | {
      independentUpdates: true
      independentUpdateAdmin: `0x${string}`
    }
  | {
      independentUpdates: false
      independentUpdateAdmin: '0x0000000000000000000000000000000000000000'
    }
  | undefined

/**
 * @description Module arguments type for the deployment
 */
export type ModuleArgs = {
  metadata: Metadata
} & EncodedArgs

/**
 * @description Issuance token arguments type for the deployment
 */
export type IssuanceTokenArgs =
  GetDeployWorkflowModuleArg<'Restricted_PIM_Factory_v1'>['issuanceToken']

/**
 * @description Initial purchase amount arguments type for the deployment
 */
export type InitialPurchaseAmountArgs =
  GetDeployWorkflowModuleArg<'Immutable_PIM_Factory_v1'>['initialPurchaseAmount']

/**
 * @description Beneficiary arguments type for the deployment
 */
export type BeneficiaryArgs =
  GetDeployWorkflowModuleArg<'Restricted_PIM_Factory_v1'>['beneficiary']

/**
 * @description Migration config arguments type for the deployment
 */
export type MigrationConfigArgs =
  GetDeployWorkflowModuleArg<'Migrating_PIM_Factory_v1'>['migrationConfig']

/**
 * @description Constructed arguments type for the deployment
 */
export type ConstructedArgs = {
  orchestrator: NonNullable<OrchestratorArgs>
  fundingManager: ModuleArgs
  authorizer: ModuleArgs
  paymentProcessor: ModuleArgs
  optionalModules: ModuleArgs[]
  issuanceToken: IssuanceTokenArgs
  initialPurchaseAmount: InitialPurchaseAmountArgs
  beneficiary: BeneficiaryArgs
  migrationConfig: MigrationConfigArgs
}

/**
 * @description User module argument type for the deployment
 */
export type UserModuleArg = Record<string, unknown>

/**
 * @description User arguments type for the deployment
 */
export type UserArgs = {
  orchestrator?: OrchestratorArgs
  fundingManager?: UserModuleArg
  authorizer?: UserModuleArg
  paymentProcessor?: UserModuleArg
  optionalModules?: Record<string, UserModuleArg>
  issuanceToken?: IssuanceTokenArgs
  initialPurchaseAmount?: InitialPurchaseAmountArgs
  beneficiary?: BeneficiaryArgs
  migrationConfig?: MigrationConfigArgs
}
