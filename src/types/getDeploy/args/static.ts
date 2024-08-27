import type { GetUserModuleArg } from '@'
import type { ValueOf } from 'type-fest-4'

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

export type IssuanceTokenArgs = ValueOf<
  GetUserModuleArg<'Restricted_PIM_Factory_v1'>
>

export type InitialPurchaseAmountArgs = ValueOf<
  GetUserModuleArg<'Immutable_PIM_Factory_v1'>
>

export type ConstructedArgs = {
  orchestrator: NonNullable<OrchestratorArgs>
  fundingManager: ModuleArgs
  authorizer: ModuleArgs
  paymentProcessor: ModuleArgs
  optionalModules: ModuleArgs[]
  issuanceToken: IssuanceTokenArgs
  initialPurchaseAmount: InitialPurchaseAmountArgs
}

export type UserModuleArg = Record<string, unknown>

export type UserArgs = {
  orchestrator?: OrchestratorArgs
  fundingManager?: UserModuleArg
  authorizer?: UserModuleArg
  paymentProcessor?: UserModuleArg
  optionalModules?: Record<string, UserModuleArg>
  issuanceToken?: IssuanceTokenArgs
  initialPurchaseAmount?: string
}
