// external dependencies
import type { PublicClient } from 'viem'

// sdk types
import type { Inverter } from '@/inverter'
import type {
  GetDeployWorkflowInputs,
  PopWalletClient,
  GetMethodsReturnType,
  MixedRequestedModules,
} from '@/types'

// exports
export * from './static'
export * from './requested'
export * from './inputs'
export * from './args'
export * from './get-methods'

/**
 * @description Parameters for the deployWorkflow function
 */
export type DeployWorkflowParams<T extends MixedRequestedModules> = {
  publicClient: PublicClient
  walletClient: PopWalletClient
  requestedModules: T
  self?: Inverter
}

/**
 * @description Return type for the deployWorkflow function
 */
export type DeployWorkflowReturnType<T extends MixedRequestedModules> = {
  inputs: GetDeployWorkflowInputs<T>
} & GetMethodsReturnType<T>
