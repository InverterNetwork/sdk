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
 * @description Constructed arguments type for the deployment
 */
export type ConstructedArgs = {
  orchestrator: NonNullable<OrchestratorArgs>
  fundingManager: ModuleArgs
  authorizer: ModuleArgs
  paymentProcessor: ModuleArgs
  optionalModules: ModuleArgs[]
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
}
