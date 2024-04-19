import { Tag } from '@inverter-network/abis'
import { AbiParameter, AbiParameterToPrimitiveType } from 'abitype'

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

type FormatParameter<P> = P extends AbiParameter & {
  tag?: Tag
  description?: string
}
  ? P extends { type: 'tuple[]' | 'tuple'; components: infer Components }
    ? {
        name: P['name']
        type: P['type']
        description: P['description']
        components: FormatParametersReturn<Components>
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
                : P['type']
        description: P['description']
        tag: P['tag']
      }
  : never

export type FormatParametersReturn<Parameters> = {
  [K in keyof Parameters]: FormatParameter<Parameters[K]>
}

type FormatPrimitiveType<P> = P extends
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
                  [N in CA[number]['name']]: FormatPrimitiveType<
                    Extract<CA[number], { name: N }>
                  >
                }
              : // 4. Check if the input type is a tuple[]
                P['type'] extends 'tuple[]'
                ? readonly {
                    [N in CA[number]['name']]: FormatPrimitiveType<
                      Extract<CA[number], { name: N }>
                    >
                  }[]
                : unknown
  : P extends AbiParameter
    ? AbiParameterToPrimitiveType<P>
    : unknown

export type FormattedParametersToPrimitiveType<Parameters> = {
  // 1. check if the input is a valid member of the tuple
  [K in keyof Parameters]: FormatPrimitiveType<Parameters[K]>
}
