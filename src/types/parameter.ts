import { Tags } from '@inverter-network/abis'
import {
  AbiParameter,
  AbiParameterKind,
  AbiParameterToPrimitiveType,
} from 'abitype'

export type FormatParametersReturn<Parameter> = {
  // 1. check if the input is a valid member of the tuple
  [K in keyof Parameter]: Parameter[K] extends AbiParameter & {
    tag?: Tags
  }
    ? // 2. check if the input is a decimal tag
      Parameter[K]['tag'] extends 'decimal'
      ? {
          name: Parameter[K]['name']
          tag: 'decimal'
          type: 'tuple'
          components: [
            {
              name: 'value'
              type: 'string'
            },
            {
              name: 'decimals'
              type: 'number'
            },
          ]
        }
      : // 3. check if the input is a any(string) tag
        Parameter[K]['tag'] extends 'any(string)'
        ? {
            name: Parameter[K]['name']
            tag: 'any(string)'
            type: 'any'
          }
        : // 4. check if the input is a tuple
          Parameter[K] extends {
              type: 'tuple[]'
              components: infer Components
            }
          ? // 5. if the input is a tuple, recursively call the FormatReturn type
            {
              name: Parameter[K]['name']
              type: Parameter[K]['type']
              components: FormatParametersReturn<Components>
            }
          : // 6. if non of the above, return the default input
            Parameter[K]
    : never
}

export type FormattedParameter =
  | {
      name: string
      type: 'string' | 'any' | 'number' | 'string[]'
      tag?: Tags
    }
  | {
      name: string
      type: 'tuple[]' | 'tuple'
      tag?: Tags
      components: readonly FormattedParameter[]
    }

type Format<Parameters> = {
  // 1. check if the input is a valid member of the tuple
  [K in keyof Parameters]: Parameters[K] extends
    | {
        name: string
        type: 'string' | 'any' | 'number' | 'uint256' | 'uint256[]'
      }
    | {
        name: string
        type: 'tuple[]' | 'tuple'
        components: infer CA extends readonly { name: string; type: unknown }[]
      }
    ? // 2. Check if the input type is format to a primitive integration type
      Parameters[K]['type'] extends 'string' | 'uint256'
      ? string
      : Parameters[K]['type'] extends 'uint256[]'
        ? readonly string[]
        : Parameters[K]['type'] extends 'number'
          ? number
          : Parameters[K]['type'] extends 'any'
            ? any
            : // 3. Check if the input type is a tuple
              Parameters[K]['type'] extends 'tuple'
              ? {
                  [N in CA[number]['name']]: Format<
                    [Extract<CA[number], { name: N }>]
                  >[0]
                }
              : // 4. Check if the input type is a tuple[]
                Parameters[K]['type'] extends 'tuple[]'
                ? readonly {
                    [N in CA[number]['name']]: Format<
                      [Extract<CA[number], { name: N }>]
                    >[0]
                  }[]
                : unknown
    : Parameters[K] extends AbiParameter
      ? AbiParameterToPrimitiveType<Parameters[K]>
      : unknown
}

export type FormatParametersToPrimitiveTypes<
  Parameters,
  T extends AbiParameterKind,
> = Format<Parameters> extends infer R extends readonly unknown[]
  ? R['length'] extends 0
    ? void
    : T extends 'inputs'
      ? R['length'] extends 1
        ? R[0]
        : R
      : `0x${string}`
  : never
