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
 * @template T - The requested modules
 * @description Parameters for the deployWorkflow function
 */
export type DeployWorkflowParams<T extends MixedRequestedModules> = {
  publicClient: PublicClient
  walletClient: PopWalletClient
  requestedModules: T
  self?: Inverter
  tagConfig?: TagConfig
}

/**
 * @template T - The requested modules
 * @description Return type for the deployWorkflow function
 */
export type DeployWorkflowReturnType<T extends MixedRequestedModules> = {
  inputs: GetDeployWorkflowInputs<T>
} & GetDeployWorkflowMethodsReturnType<T>
