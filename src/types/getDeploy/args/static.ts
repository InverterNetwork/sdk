import type { GetUserModuleArg } from '@'

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
      independentUpdates: true
      independentUpdateAdmin: `0x${string}`
    }
  | {
      independentUpdates: false
      independentUpdateAdmin: '0x0000000000000000000000000000000000000000'
    }
  | undefined

export type ModuleArgs = {
  metadata: Metadata
} & EncodedArgs

export type IssuanceTokenArgs =
  GetUserModuleArg<'Restricted_PIM_Factory_v1'>['issuanceToken']

export type InitialPurchaseAmountArgs =
  GetUserModuleArg<'Immutable_PIM_Factory_v1'>['initialPurchaseAmount']

export type BeneficiaryArgs =
  GetUserModuleArg<'Restricted_PIM_Factory_v1'>['beneficiary']

export type ConstructedArgs = {
  orchestrator: NonNullable<OrchestratorArgs>
  fundingManager: ModuleArgs
  authorizer: ModuleArgs
  paymentProcessor: ModuleArgs
  optionalModules: ModuleArgs[]
  issuanceToken: IssuanceTokenArgs
  initialPurchaseAmount: InitialPurchaseAmountArgs
  beneficiary: BeneficiaryArgs
  isImmutable: boolean
}

export type UserModuleArg = Record<string, unknown>

export type UserArgs = {
  orchestrator?: OrchestratorArgs
  fundingManager?: UserModuleArg
  authorizer?: UserModuleArg
  paymentProcessor?: UserModuleArg
  optionalModules?: Record<string, UserModuleArg>
  issuanceToken?: IssuanceTokenArgs
  initialPurchaseAmount?: InitialPurchaseAmountArgs
  beneficiary?: BeneficiaryArgs
  isImmutable?: boolean
}
