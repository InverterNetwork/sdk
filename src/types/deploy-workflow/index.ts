// external dependencies
import type { PublicClient } from 'viem'

// sdk types
import type { Inverter } from '@/inverter'
import type {
  GetDeployWorkflowInputs,
  FactoryType,
  RequestedModules,
  PopWalletClient,
  GetMethodsReturnType,
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
export type DeployWorkflowParams<
  T extends RequestedModules<FT extends undefined ? 'default' : FT>,
  FT extends FactoryType | undefined = undefined,
> = {
  publicClient: PublicClient
  walletClient: PopWalletClient
  requestedModules: T
  factoryType?: FT
  self?: Inverter
}

/**
 * @description Return type for the deployWorkflow function
 */
export type DeployWorkflowReturnType<
  T extends RequestedModules<FT extends undefined ? 'default' : FT>,
  FT extends FactoryType | undefined = undefined,
> = {
  inputs: GetDeployWorkflowInputs<T, FT extends undefined ? 'default' : FT>
} & GetMethodsReturnType<T, FT extends undefined ? 'default' : FT>
