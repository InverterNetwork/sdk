import type { PublicClient } from 'viem'
import type { PopWalletClient } from '../utils'
import type { FactoryType, Inverter, RequestedModules } from '../..'

export * from './generic'
export * from './requested'
export * from './parameter'
export * from './schema'
export * from './args'
export * from './get-methods'

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

export type GetDeployReturn<
  T extends RequestedModules<FT extends undefined ? 'default' : FT>,
  FT extends FactoryType | undefined = undefined,
> = Awaited<ReturnType<typeof import('@/get-deploy').default<T, FT>>>
