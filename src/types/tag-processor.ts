// external dependencies
import type { ExtendedAbiParameter, Tag } from '@inverter-network/abis'
// sdk types
import type { Inverter } from '@/inverter'
import type {
  PopPublicClient,
  PopWalletClient,
  RequiredAllowances,
  TagConfig,
  TagOverwrites,
} from '@/types'
import type { PublicClient } from 'viem'

/**
 * @description The parameters for the tagProcessorDecimals function
 */
export type TagProcessorDecimalsParams = {
  argsOrRes: any[]
  parameters: readonly ExtendedAbiParameter[]
  tagConfig?: TagConfig
  tag?: Tag
  publicClient: PublicClient
  contract?: any
  self?: Inverter
  tagOverwrites?: TagOverwrites
}

/**
 * @description The parameters for the tagProcessorAllowances function
 */
export type TagProcessorAllowancesParams = {
  transferAmount: bigint
  spenderAddress: `0x${string}`
  publicClient: PublicClient
  tokenAddress?: `0x${string}`
  userAddress?: `0x${string}`
}

/**
 * @description The parameters for the tagProcessorApprove function
 */
export type TagProcessorApproveParams = {
  requiredAllowances: RequiredAllowances[]
  publicClient: PopPublicClient
  walletClient?: PopWalletClient
}
