import { Tag } from '@inverter-network/abis'
import {
  AbiParameter,
  AbiParameterToPrimitiveType,
  SolidityBytes,
} from 'abitype'

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
        type: P['tag'] extends 'any'
          ? 'any'
          : P['type'] extends 'uint256'
            ? 'string'
            : P['type'] extends 'uint256[]'
              ? 'string[]'
              : P['type'] extends 'bool'
                ? 'boolean'
                : P['type'] extends SolidityBytes
                  ? '0xstring'
                  : P['type']
        description: P['description']
        tag: P['tag']
      }
  : never

// Format the types as typescript consumable type
export type FormattedParameterToPrimitiveType<P> =
  // 1. Check if the input type is a valid type which can be converted to a primitive type
  P extends
    | {
        name: string
        type: 'string' | 'any' | 'number' | 'string[]' | 'boolean'
      }
    | {
        name: string
        type: 'tuple[]' | 'tuple'
        components: infer CA extends readonly { name: string; type: unknown }[]
      }
    ? // 2. Check if the input type is format to a primitive integration type
      P['type'] extends 'boolean'
      ? boolean
      : P['type'] extends '0xstring'
        ? `0x${string}`
        : P['type'] extends 'string'
          ? string
          : P['type'] extends 'string[]'
            ? readonly string[]
            : P['type'] extends 'number'
              ? number
              : P['type'] extends 'any'
                ? any
                : // 3. Check if the input type is a tuple
                  P['type'] extends 'tuple'
                  ? {
                      [N in CA[number]['name']]: FormattedParameterToPrimitiveType<
                        Extract<CA[number], { name: N }>
                      >
                    }
                  : // 4. Check if the input type is a tuple[]
                    P['type'] extends 'tuple[]'
                    ? readonly {
                        [N in CA[number]['name']]: FormattedParameterToPrimitiveType<
                          Extract<CA[number], { name: N }>
                        >
                      }[]
                    : unknown
    : P extends AbiParameter
      ? AbiParameterToPrimitiveType<P>
      : unknown

// Itterate over the parameters and format them
export type FormatParameters<Parameters> = {
  [K in keyof Parameters]: FormatParameter<Parameters[K]>
}

// Itterate over the parameters and format them to primitive types
export type FormattedParametersToPrimitiveType<Parameters> = {
  [K in keyof Parameters]: FormattedParameterToPrimitiveType<Parameters[K]>
}
