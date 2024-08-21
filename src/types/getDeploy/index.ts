import type { PublicClient } from 'viem'
import type { PopWalletClient } from '../utils'
import type { FactoryType, Inverter, RequestedModules } from '../..'

export * from './generic'
export * from './requested'
export * from './parameter'
export * from './schema'
export * from './args'

export type GetDeployParams<
  T extends RequestedModules<FT>,
  FT extends FactoryType = 'default',
> = {
  publicClient: PublicClient
  walletClient: PopWalletClient
  requestedModules: T
  factoryType?: FT
  self?: Inverter
}
