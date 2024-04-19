import { Tag } from '@inverter-network/abis'

export type NonTupleType =
  | 'string'
  | '0xstring'
  | 'any'
  | 'number'
  | 'string[]'
  | 'boolean'

export type NonTupleFormattedAbiParameter = {
  name: string
  type: NonTupleType
  tag?: Tag
  description?: string
}

export type TupleFormattedAbiParameter = {
  name: string
  type: 'tuple[]' | 'tuple'
  tag?: Tag
  description?: string
  components: readonly FormattedAbiParameter[]
}

export type FormattedAbiParameter =
  | NonTupleFormattedAbiParameter
  | TupleFormattedAbiParameter
