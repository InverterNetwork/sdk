import type {
  ExtendedAbiParameter,
  NonTupleType,
  Tag,
  TupleType,
} from '@inverter-network/abis'
import type { SolidityBytes, SolidityInt } from 'abitype'
import type { FormattedParameterToPrimitiveType } from './primitive'
import type { OmitNever } from '..'
import type { IfUnknown, Simplify } from 'type-fest-4'

export * from './primitive'

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
      : T extends 'bool[]'
        ? 'boolean[]'
        : T extends SolidityInt
          ? 'numberString'
          : T extends `${SolidityInt}[]`
            ? 'numberString[]'
            : T extends SolidityBytes
              ? '0xstring'
              : T extends `${SolidityBytes}[]`
                ? '0xstring[]'
                : T extends 'address'
                  ? '0xstring'
                  : T extends 'address[]'
                    ? '0xstring[]'
                    : never

// Format the AbiParameter type from solidity to typscript type and-
// add the description and tag to the parameter
export type FormatParameter<P> = P extends ExtendedAbiParameter
  ? Simplify<
      OmitNever<
        P extends { type: TupleType; components: infer Components }
          ? {
              name: P['name']
              type: P['type']
              description: IfUnknown<P['description'], never, P['description']>
              components: FormatParameters<Components>
            }
          : {
              name: P['name']
              type: P['type']
              description: IfUnknown<P['description'], never, P['description']>
              jsType: GetJsType<P['type'], P['tags']>
              tags: IfUnknown<P['tags'], never, P['tags']>
            }
      >
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
