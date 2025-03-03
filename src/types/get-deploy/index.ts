// external dependencies
import type { PublicClient } from 'viem'

// sdk types
import type { Inverter } from '@/inverter'
import type {
  DeploySchema,
  FactoryType,
  RequestedModules,
  PopWalletClient,
  GetMethodsReturnType,
} from '@/types'

// exports
export * from './static'
export * from './requested'
export * from './schema'
export * from './args'
export * from './get-methods'

/**
 * @description Parameters for the getDeploy function
 */
export type GetDeployParams<
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
 * @description Return type for the getDeploy function
 */
export type GetDeployReturnType<
  T extends RequestedModules<FT extends undefined ? 'default' : FT>,
  FT extends FactoryType | undefined = undefined,
> = {
  inputs: DeploySchema<T, FT extends undefined ? 'default' : FT>
} & GetMethodsReturnType<T, FT extends undefined ? 'default' : FT>
