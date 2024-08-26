import { type JsType } from '@/types'

import type {
  ExtendedAbiParameter,
  NonTupleType,
  TupleType,
} from '@inverter-network/abis'

// AbiParameter without components field + description, tag and jsType fields
export type NonTupleFormattedAbiParameter = Exclude<
  ExtendedAbiParameter,
  {
    type: TupleType
  }
> & {
  jsType?: JsType
}

// AbiParameter with components field, components field is an array of FormattedAbiParameters
export type TupleFormattedAbiParameter = Omit<
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

// FormattedAbiParameter is either a NonTupleFormattedAbiParameter or a TupleFormattedAbiParameter
export type FormattedAbiParameter =
  | NonTupleFormattedAbiParameter
  | TupleFormattedAbiParameter
