import type { Tag } from '@inverter-network/abis'
import type { Inverter } from '@/index'

/**
 * @description The parameters for the cacheToken function
 */
export type CacheTokenParams = {
  self: Inverter
  tag: Tag
  tokenAddress?: `0x${string}`
  moduleAddress: `0x${string}`
  decimals: number
}
