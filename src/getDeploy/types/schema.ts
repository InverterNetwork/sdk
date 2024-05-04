import { FormattedAbiParameter } from '../../types'

export type ModuleSchema = {
  name: string
  version: string
  inputs: FormattedAbiParameter[]
}

export type DeploySchema = {
  orchestrator: ModuleSchema
  paymentProcessor: ModuleSchema
  fundingManager: ModuleSchema
  authorizer: ModuleSchema
  optionalModules?: ModuleSchema[]
}
