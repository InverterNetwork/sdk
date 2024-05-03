import {
  ExtendedAbiParameter,
  NonTupleType,
  Pretty,
  TupleType,
} from '@inverter-network/abis'
import { JsType } from './base'

// AbiParameter without components field + description, tag and jsType fields
export type NonTupleFormattedAbiParameter = Pretty<
  Exclude<
    ExtendedAbiParameter,
    {
      type: TupleType
    }
  > & {
    jsType?: JsType
  }
>

// AbiParameter with components field, components field is an array of FormattedAbiParameters
export type TupleFormattedAbiParameter = Pretty<
  Omit<
    Exclude<
      ExtendedAbiParameter,
      {
        type: NonTupleType
      }
    >,
    'components'
  > & {
    components: readonly FormattedAbiParameter[]
  }
>

// FormattedAbiParameter is either a NonTupleFormattedAbiParameter or a TupleFormattedAbiParameter
export type FormattedAbiParameter =
  | NonTupleFormattedAbiParameter
  | TupleFormattedAbiParameter
