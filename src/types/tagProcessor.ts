import type { Extras, Inverter, TagOverwrites } from '@'
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
