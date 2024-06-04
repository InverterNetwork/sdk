import { Tag } from '@inverter-network/abis'

export type RequiredAllowances = {
  amount: bigint
  spender: `0x${string}`
  owner: `0x${string}`
  token: `0x${string}`
}

export type TagCallbackType = 'parseDecimals' | 'formatDecimals'

export type DecimalsTagReturn = {
  decimals: number
  tokenAddress?: `0x${string}`
}

export type ApprovalTagDeps = {
  transferAmount: bigint
  tokenAddress?: `0x${string}`
}

export type ApprovalTagReturn = {
  amount: bigint
  spender: `0x${string}`
  owner: `0x${string}`
  token: `0x${string}`
}

export type TagCallbackReturn<T extends TagCallbackType> =
  T extends 'parseDecimals'
    ? bigint
    : T extends 'formatDecimals'
      ? string
      : never

export type TagCallback<T extends TagCallbackType = TagCallbackType> = (
  type: T,
  tags: readonly Tag[],
  argOrRes: any
) => Promise<TagCallbackReturn<T>>

// (
//   decimalsTag: Tag,
//   approvalTag: Tag | undefined,
//   arg: any
// ) => Promise<bigint>
