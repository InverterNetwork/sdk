export type Metadata = {
  majorVersion: bigint
  minorVersion: bigint
  url: string
  title: string
}

export type EncodedArgs = {
  configData: `0x${string}`
  dependencyData: `0x${string}`
}

export type OrchestratorArgs = {
  owner: `0x${string}`
  token: `0x${string}`
}

export type ModuleArgs = {
  metadata: Metadata
} & EncodedArgs

export type ConstructedArgs = {
  orchestrator: OrchestratorArgs
  fundingManager: ModuleArgs
  authorizer: ModuleArgs
  paymentProcessor: ModuleArgs
  optionalModules: ModuleArgs[]
}
