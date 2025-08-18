// external dependencies

// sdk types
import type { Inverter } from '@/inverter'
import type {
  GetDeployWorkflowInputs,
  GetDeployWorkflowMethodsReturnType,
  MixedRequestedModules,
  PopWalletClient,
  TagConfig,
} from '@/types'
import type { PublicClient } from 'viem'

// exports
export * from './static'
export * from './requested'
export * from './inputs'
export * from './args'
export * from './get-methods'

/**
 * @template TRequestedModules - The requested modules
 * @description Parameters for the deployWorkflow function
 */
export type DeployWorkflowParams<
  TRequestedModules extends MixedRequestedModules,
  TUseTags extends boolean = true,
> = {
  publicClient: PublicClient
  walletClient: PopWalletClient
  requestedModules: TRequestedModules
  self?: Inverter
  tagConfig?: TagConfig
  useTags?: TUseTags
}

/**
 * @template TRequestedModules - The requested modules
 * @description Return type for the deployWorkflow function
 */
export type DeployWorkflowReturnType<
  TRequestedModules extends MixedRequestedModules,
  TUseTags extends boolean = true,
> = {
  inputs: GetDeployWorkflowInputs<TRequestedModules>
} & GetDeployWorkflowMethodsReturnType<TRequestedModules, TUseTags>
