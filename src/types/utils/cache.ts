import type { Inverter } from '@'
import type { Tag } from '@inverter-network/abis'

export type CacheTokenProps = {
  self: Inverter
  tag: Tag
  tokenAddress?: `0x${string}`
  moduleAddress: `0x${string}`
  decimals: number
}
