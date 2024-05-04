import { ExtendedAbiParameter, Tag, TupleType } from '@inverter-network/abis'
import { SolidityBytes, SolidityInt } from 'abitype'
import { FormattedParameterToPrimitiveType } from './primitive'

type JsTypeWithTag<P extends readonly Tag[] | undefined> =
  P extends readonly Tag[]
    ? P[number] extends 'any'
      ? 'any'
      : undefined
    : undefined

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
    : {
        name: P['name']
        type: P['type']
        jsType: JsTypeWithTag<P['tags']> extends string
          ? JsTypeWithTag<P['tags']>
          : P['type'] extends 'bool'
            ? 'boolean'
            : P['type'] extends SolidityInt
              ? 'string'
              : P['type'] extends `${SolidityInt}[]`
                ? 'string[]'
                : P['type'] extends SolidityBytes
                  ? '0xstring'
                  : P['type'] extends `${SolidityBytes}[]`
                    ? '0xstring[]'
                    : undefined

        description: P['description']
        tags: P['tags'] extends unknown ? undefined : P['tags']
      }
  : never

// Itterate over the parameters and format them
export type FormatParameters<Parameters> = {
  [K in keyof Parameters]: FormatParameter<Parameters[K]>
}

// Itterate over the parameters and format them to primitive types
export type FormattedParametersToPrimitiveType<Parameters> = {
  [K in keyof Parameters]: FormattedParameterToPrimitiveType<Parameters[K]>
}
