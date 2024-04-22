import { Tag } from '@inverter-network/abis'
import {
  SolidityArray,
  SolidityAddress,
  SolidityBool,
  SolidityBytes,
  SolidityInt,
  SolidityString,
  SolidityTuple,
  SolidityArrayWithTuple,
} from 'abitype'

export type NonTupleType = Exclude<
  | SolidityArray
  | SolidityAddress
  | SolidityBool
  | SolidityBytes
  | SolidityInt
  | SolidityString,
  SolidityTuple | SolidityArrayWithTuple
>

export type JsType =
  | 'string'
  | 'boolean'
  | '0xstring'
  | 'string[]'
  | '0xstring[]'
  | 'any'

export type NonTupleFormattedAbiParameter = {
  name: string
  type: NonTupleType
  jsType?: JsType
  tag?: Tag
  description?: string
}

export type TupleFormattedAbiParameter = {
  name: string
  type: 'tuple[]' | 'tuple'
  description?: string
  components: readonly FormattedAbiParameter[]
}

export type FormattedAbiParameter =
  | NonTupleFormattedAbiParameter
  | TupleFormattedAbiParameter
