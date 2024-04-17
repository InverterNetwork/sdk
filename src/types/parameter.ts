import { Tag } from '@inverter-network/abis'
import { AbiParameter, AbiParameterToPrimitiveType } from 'abitype'

export type FormatParametersReturn<Parameters> = {
  // 1. check if the input is a valid member of the tuple
  [K in keyof Parameters]: Parameters[K] extends AbiParameter & {
    tag?: Tag
  }
    ? // 2. check if the input is a decimals tag
      // prettier-ignore
      Parameters[K]['tag'] extends 'decimals'
      ? {
          name: Parameters[K]['name']
          tag: 'decimals'
          type: 'string'
        }
      : // 3. check if the input is a any tag
      // prettier-ignore
      Parameters[K]['tag'] extends 'any'
      ? {
          name: Parameters[K]['name']
          tag: 'any'
          type: 'any'
        }
      : // 4. check if the input is a tuple
        Parameters[K] extends {
            type: 'tuple[]' | 'tuple'
            components: infer Components
          }
        ? // 5. if the input is a tuple, recursively call the FormatReturn type
          {
            name: Parameters[K]['name']
            type: Parameters[K]['type']
            components: FormatParametersReturn<Components>
          }
        : // 6. if non of the above, return the default input
          Parameters[K]['type'] extends 'uint256'
          ? {
              name: Parameters[K]['name']
              type: 'string'
            }
          : Parameters[K]['type'] extends 'uint256[]'
            ? {
                name: Parameters[K]['name']
                type: 'string[]'
              }
            : Parameters[K]['type'] extends 'bool'
              ? {
                  name: Parameters[K]['name']
                  type: 'boolean'
                }
              : {
                  name: Parameters[K]['name']
                  type: Parameters[K]['type']
                }
    : never
}

type Tuple<CA extends readonly any[]> = {
  [N in CA[number]['name']]: FormattedParametersToPrimitiveType<
    [Extract<CA[number], { name: N }>]
  >[0]
}

export type FormattedParametersToPrimitiveType<Parameters> = {
  // 1. check if the input is a valid member of the tuple
  [K in keyof Parameters]: Parameters[K] extends
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
      Parameters[K]['type'] extends 'boolean'
      ? boolean
      : Parameters[K]['type'] extends 'string'
        ? string
        : Parameters[K]['type'] extends 'string[]'
          ? readonly string[]
          : Parameters[K]['type'] extends 'number'
            ? number
            : Parameters[K]['type'] extends 'any'
              ? any
              : // 3. Check if the input type is a tuple
                Parameters[K]['type'] extends 'tuple'
                ? Tuple<CA>
                : // 4. Check if the input type is a tuple[]
                  Parameters[K]['type'] extends 'tuple[]'
                  ? readonly Tuple<CA>[]
                  : unknown
    : Parameters[K] extends AbiParameter
      ? AbiParameterToPrimitiveType<Parameters[K]>
      : unknown
}

export type FormattedParameter =
  | {
      name: string
      type: 'string' | 'any' | 'number' | 'string[]'
      tag?: Tag
    }
  | {
      name: string
      type: 'tuple[]' | 'tuple'
      tag?: Tag
      components: readonly FormattedParameter[]
    }
