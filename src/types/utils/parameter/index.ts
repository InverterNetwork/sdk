import {
  ExtendedAbiParameter,
  NonTupleType,
  Pretty,
  Tag,
  TupleType,
} from '@inverter-network/abis'
import { SolidityBytes, SolidityInt } from 'abitype'
import { FormattedParameterToPrimitiveType } from './primitive'

type JsTypeWithTag<P extends readonly Tag[] | undefined> =
  P extends readonly Tag[]
    ? P[number] extends 'any'
      ? 'any'
      : undefined
    : undefined

type GetJsType<
  T extends NonTupleType | TupleType,
  Tags extends readonly Tag[] | undefined,
> =
  JsTypeWithTag<Tags> extends string
    ? JsTypeWithTag<Tags>
    : T extends 'bool'
      ? 'boolean'
      : T extends SolidityInt
        ? 'string'
        : T extends `${SolidityInt}[]`
          ? 'string[]'
          : T extends SolidityBytes
            ? '0xstring'
            : T extends `${SolidityBytes}[]`
              ? '0xstring[]'
              : undefined

// prettier-ignore
type FilteredKeys<T> = {[P in keyof T]: T[P] extends undefined ? never : P}[keyof T]
// prettier-ignore
type ExcludeUndefinedFields<O> = {[K in FilteredKeys<O>]: O[K]}

// Format the AbiParameter type from solidity to typscript type and-
// add the description and tag to the parameter
export type FormatParameter<P> = P extends ExtendedAbiParameter
  ? P extends { type: TupleType; components: infer Components }
    ? {
        name: P['name']
        type: P['type']
        description: P['description']
        components: FormatParameters<Components>
      }
    : Pretty<
        ExcludeUndefinedFields<{
          name: P['name']
          type: P['type']
          description: P['description']
          jsType: GetJsType<P['type'], P['tags']>
          tags: P['tags'] extends unknown ? undefined : P['tags']
        }>
      >
  : never

// Itterate over the parameters and format them
export type FormatParameters<Parameters> = {
  [K in keyof Parameters]: FormatParameter<Parameters[K]>
}

// Itterate over the parameters and format them to primitive types
export type FormattedParametersToPrimitiveType<Parameters> = {
  [K in keyof Parameters]: FormattedParameterToPrimitiveType<Parameters[K]>
}
