import { GetModuleVersion, ModuleName, Pretty } from '@inverter-network/abis'
import { OrchestratorInputs } from './generic'
import { FomrattedDeploymentParameters } from './parameter'

export type ModuleSchema<
  N extends ModuleName = ModuleName,
  V extends GetModuleVersion<N> = GetModuleVersion<N>,
> = {
  name: N
  version: V
  inputs: FomrattedDeploymentParameters<N, V>
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
