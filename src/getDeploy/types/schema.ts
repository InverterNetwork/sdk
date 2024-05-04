import { Pretty } from '@inverter-network/abis'
import { FormattedAbiParameter } from '../../types'
import { OrchestratorInputs } from './generic'

export type ModuleSchema = {
  name: string
  version: string
  inputs: readonly FormattedAbiParameter[]
}

export type MendatoryDeploySchema = {
  paymentProcessor: ModuleSchema
  fundingManager: ModuleSchema
  authorizer: ModuleSchema
}

export type OptionalDeploySchema = {
  optionalModules?: ModuleSchema[]
}

export type DeploySchema = Pretty<
  {
    orchestrator: OrchestratorInputs
  } & MendatoryDeploySchema &
    OptionalDeploySchema
>
