import { Tag } from '@inverter-network/abis'

export type RequiredAllowances = {
  amount: bigint
  spender: `0x${string}`
  owner: `0x${string}`
  token: `0x${string}`
}

export type TokenCallback = (
  decimalsTag: Tag,
  approvalTag: Tag | undefined,
  arg: any
) => Promise<bigint>
