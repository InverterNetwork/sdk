import type { AbiParameter, AbiParameterToPrimitiveType } from 'abitype'
import type { JsType } from '../..'
import type { Simplify } from 'type-fest-4'

// Non Tuple types Formatter
type SimplePrimitive<P> = P extends {
  name: string
  // Exclude these types to handle with abitype utils
  jsType: Exclude<JsType, '0xstring' | '0xstring[]' | 'boolean'>
}
  ? P['jsType'] extends 'numberString'
    ? string
    : P['jsType'] extends 'numberString[]'
      ? readonly string[]
      : P['jsType'] extends 'any'
        ? any
        : unknown
  : never

// Tuple Util deduplication
type TupleUtils<Components extends readonly any[]> = {
  [N in Components[number]['name']]: FormattedParameterToPrimitiveType<
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
          : unknown
    >
  : never

// Fallback to abitype utils ( deduplication )
type DefaultPrimitive<P> = P extends AbiParameter
  ? AbiParameterToPrimitiveType<P>
  : unknown

// Main Formatter
export type FormattedParameterToPrimitiveType<P> =
  SimplePrimitive<P> extends never
    ? TuplePrimitive<P> extends never
      ? DefaultPrimitive<P>
      : TuplePrimitive<P>
    : SimplePrimitive<P>
