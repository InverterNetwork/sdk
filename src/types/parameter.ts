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
import { JsType } from './base'

// Tuple and Tuple array types, AbiParamters with these types have a components field
export type TupleType = 'tuple' | 'tuple[]'

// Non-tuple types, AbiParameters with these types do not have a components field
export type NonTupleType = Exclude<
  | SolidityArray
  | SolidityAddress
  | SolidityBool
  | SolidityBytes
  | SolidityInt
  | SolidityString,
  SolidityTuple | SolidityArrayWithTuple
>

// AbiParameter without components field + description, tag and jsType fields
export type NonTupleFormattedAbiParameter = {
  name: string
  type: NonTupleType
  jsType?: JsType
  tag?: Tag
  description?: string
}

// AbiParameter with components field, components field is an array of FormattedAbiParameters
export type TupleFormattedAbiParameter = {
  name: string
  type: TupleType
  description?: string
  components: readonly FormattedAbiParameter[]
}

// FormattedAbiParameter is either a NonTupleFormattedAbiParameter or a TupleFormattedAbiParameter
export type FormattedAbiParameter =
  | NonTupleFormattedAbiParameter
  | TupleFormattedAbiParameter
