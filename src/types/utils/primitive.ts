import type { AbiParameter, AbiParameterToPrimitiveType } from 'abitype'
import type { Simplify, Includes } from 'type-fest-4'
import type { Tag } from '@inverter-network/abis'

// Tag to Primitive type
type TagToPrimitiveType<P> = P extends { tags: readonly Tag[] | Tag[] }
  ? Includes<P['tags'], 'any'> extends true
    ? any
    : never
  : never

// Non Tuple types Formatter
type SimplePrimitive<P> = P extends AbiParameter
  ? // Check if the parameter has a tag type
    TagToPrimitiveType<P> extends never
    ? // If not, transform the parameter to a primitive type
      AbiParameterToPrimitiveType<P> extends infer Primitive
      ? // Check if the primitive type is a bigint
        Primitive extends bigint
        ? // If it is, transform it to a string
          string
        : // If not, return the primitive type
          Primitive
      : never
    : TagToPrimitiveType<P>
  : never

// Tuple Util deduplication
type TupleUtils<Components extends readonly any[]> = {
  [N in Components[number]['name']]: ExtendedParameterToPrimitiveType<
    Extract<Components[number], { name: N }>
  >
}
// For Reccursive Tuple types
type TuplePrimitive<P> = P extends {
  name: string
  type: 'tuple' | 'tuple[]'
  components: infer CA extends readonly any[]
}
  ? Simplify<
      P['type'] extends 'tuple'
        ? TupleUtils<CA>
        : P['type'] extends 'tuple[]'
          ? readonly TupleUtils<CA>[]
          : never
    >
  : never

// Main Formatter
export type ExtendedParameterToPrimitiveType<P> =
  TuplePrimitive<P> extends never ? SimplePrimitive<P> : TuplePrimitive<P>

// Itterate over the parameters and format them to primitive types
export type ExtendedParametersToPrimitiveType<Parameters> = {
  [K in keyof Parameters]: ExtendedParameterToPrimitiveType<Parameters[K]>
}
