import {
  ExtendedAbiParameter,
  NonTupleType,
  TupleType,
} from '@inverter-network/abis'
import { JsType } from './base'
import { Simplify } from 'type-fest'

// AbiParameter without components field + description, tag and jsType fields
export type NonTupleFormattedAbiParameter = Simplify<
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
export type TupleFormattedAbiParameter = Simplify<
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
