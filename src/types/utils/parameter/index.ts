import { Tag } from '@inverter-network/abis'
import { AbiParameter, SolidityBytes, SolidityInt } from 'abitype'
import { FormattedParameterToPrimitiveType } from './primitive'

// Format the AbiParameter type from solidity to typscript type and-
// add the description and tag to the parameter
export type FormatParameter<P> = P extends AbiParameter & {
  tag?: Tag
  description?: string
}
  ? P extends { type: 'tuple[]' | 'tuple'; components: infer Components }
    ? {
        name: P['name']
        type: P['type']
        description: P['description']
        components: FormatParameters<Components>
      }
    : {
        name: P['name']
        type: P['type']
        jsType: P['tag'] extends 'any'
          ? 'any'
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
                    : unknown
        description: P['description']
        tag: P['tag']
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
