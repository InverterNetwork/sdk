import { Tags } from '@inverter-network/abis'
import { AbiParameter, AbiParameterToPrimitiveType } from 'abitype'

export type FormattedParametersToPrimitiveType<Parameters> = {
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
                  [N in CA[number]['name']]: FormattedParametersToPrimitiveType<
                    [Extract<CA[number], { name: N }>]
                  >[0]
                }
              : // 4. Check if the input type is a tuple[]
                Parameters[K]['type'] extends 'tuple[]'
                ? readonly {
                    [N in CA[number]['name']]: FormattedParametersToPrimitiveType<
                      [Extract<CA[number], { name: N }>]
                    >[0]
                  }[]
                : unknown
    : Parameters[K] extends AbiParameter
      ? AbiParameterToPrimitiveType<Parameters[K]>
      : unknown
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
