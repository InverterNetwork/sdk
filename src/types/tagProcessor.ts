import type {
  Extras,
  Inverter,
  PopPublicClient,
  PopWalletClient,
  RequiredAllowances,
  TagOverwrites,
} from '@'
import type { ExtendedAbiParameter, Tag } from '@inverter-network/abis'
import type { PublicClient } from 'viem'

export type TagProcessorDecimalsParams = {
  argsOrRes: any[]
  parameters: readonly ExtendedAbiParameter[]
  extras?: Extras
  tag?: Tag
  publicClient: PublicClient
  contract?: any
  self?: Inverter
  tagOverwrites?: TagOverwrites
}

export type TagProcessorAllowancesParams = {
  transferAmount: bigint
  spenderAddress: `0x${string}`
  publicClient: PublicClient
  tokenAddress?: `0x${string}`
  userAddress?: `0x${string}`
}

export type TagProcessorApproveParams = {
  requiredAllowances: RequiredAllowances[]
  publicClient: PopPublicClient
  walletClient?: PopWalletClient
}
