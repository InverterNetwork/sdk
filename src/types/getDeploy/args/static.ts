export type Metadata = {
  majorVersion: bigint
  minorVersion: bigint
  url: string
  title: string
}

export type EncodedArgs = {
  configData: `0x${string}`
}

export type OrchestratorArgs =
  | {
      independentUpdates: boolean
      independentUpdateAdmin: `0x${string}`
    }
  | undefined

export type ModuleArgs = {
  metadata: Metadata
} & EncodedArgs

export type ConstructedArgs = {
  orchestrator: NonNullable<OrchestratorArgs>
  fundingManager: ModuleArgs
  authorizer: ModuleArgs
  paymentProcessor: ModuleArgs
  optionalModules: ModuleArgs[]
}

export type UserModuleArg = Record<string, unknown>

export type UserArgs = {
  orchestrator?: OrchestratorArgs
  fundingManager?: UserModuleArg
  authorizer?: UserModuleArg
  paymentProcessor?: UserModuleArg
  optionalModules?: Record<string, UserModuleArg>
}
