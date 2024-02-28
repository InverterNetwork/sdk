import { Tags } from '@inverter-network/abis'
import { AbiParameter, AbiParameterToPrimitiveType } from 'abitype'

export type FormatParametersReturn<Parameter> = {
  // 1. check if the input is a valid member of the tuple
  [K in keyof Parameter]: Parameter[K] extends AbiParameter & {
    tag?: Tags
  }
    ? // 2. check if the input is a decimal tag
      Parameter[K]['tag'] extends 'decimal'
      ? {
          name: Parameter[K]['name']
          type: 'tuple[]'
          components: [
            {
              name: 'value'
              type: Parameter[K]['type']
            },
            {
              name: 'decimals'
              type: 'uint8'
            },
          ]
        }
      : // 3. check if the input is a any(string) tag
        Parameter[K]['tag'] extends 'any(string)'
        ? {
            name: Parameter[K]['name']
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

export type FormatParametersToPrimitiveTypes<Parameters> = {
  [K in keyof Parameters]: Parameters[K] extends
    | {
        name: string
        type: 'string' | 'any' | 'uint256' | 'uint8'
      }
    | {
        name: string
        type: 'tuple[]'
        components: unknown
      }
    ? Parameters[K]['type'] extends 'string' | 'uint256' | 'uint8'
      ? string
      : Parameters[K]['type'] extends 'any'
        ? any
        : Parameters[K] extends { type: 'tuple[]' }
          ? FormatParametersToPrimitiveTypes<Parameters[K]['components']>
          : unknown
    : Parameters[K] extends AbiParameter
      ? AbiParameterToPrimitiveType<Parameters[K]>
      : unknown
}
