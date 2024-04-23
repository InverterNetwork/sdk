import { Tag } from '@inverter-network/abis'
import { SolidityTuple, SolidityArrayWithTuple, AbiType } from 'abitype'
import { JsType } from './base'

type FormattedParameterBase = {
  name?: string
  description?: string
}

// Tuple and Tuple array types, AbiParamters with these types have a components field
export type TupleType = 'tuple' | 'tuple[]'

// Non-tuple types, AbiParameters with these types do not have a components field
export type NonTupleType = Exclude<
  AbiType,
  SolidityTuple | SolidityArrayWithTuple
>

// AbiParameter without components field + description, tag and jsType fields
export type NonTupleFormattedAbiParameter = FormattedParameterBase & {
  type: NonTupleType
  jsType?: JsType
  tag?: Tag
}

// AbiParameter with components field, components field is an array of FormattedAbiParameters
export type TupleFormattedAbiParameter = FormattedParameterBase & {
  type: TupleType
  components: readonly FormattedAbiParameter[]
}

// FormattedAbiParameter is either a NonTupleFormattedAbiParameter or a TupleFormattedAbiParameter
export type FormattedAbiParameter =
  | NonTupleFormattedAbiParameter
  | TupleFormattedAbiParameter
