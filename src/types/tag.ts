// external dependencies
import type { Tag } from '@inverter-network/abis'

/**
 * @description The required allowances type
 */
export type RequiredAllowances = {
  amount: bigint
  spender: `0x${string}`
  owner: `0x${string}`
  token: `0x${string}`
}

/**
 * @description The tag callback type
 */
export type TagCallbackType = 'parseDecimals' | 'formatDecimals'

/**
 * @description The decimals tag return type
 */
export type DecimalsTagReturnType = {
  decimals: number
  tokenAddress?: `0x${string}`
}

/**
 * @description The tag callback return type
 * @template T - The tag callback type
 */
export type TagCallbackReturnType<T extends TagCallbackType> =
  T extends 'parseDecimals'
    ? bigint
    : T extends 'formatDecimals'
      ? string
      : never

/**
 * @description The tag callback type
 * @template T - The tag callback type
 */
export type TagCallback<T extends TagCallbackType = TagCallbackType> = (
  type: T,
  tags: readonly Tag[],
  argOrRes: any
) => Promise<TagCallbackReturnType<T>>

/**
 * @description The tag overwrites type
 */
export type TagOverwrites = {
  issuanceTokenDecimals?: number
}
