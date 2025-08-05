import type { Tag } from '@inverter-network/abis'
import type { AbiParameter, AbiParameterToPrimitiveType } from 'abitype'
import type { Includes, Simplify } from 'type-fest-4'

/**
 * @description The tag to primitive type
 * @template P - The parameter
 * @returns The primitive type
 */
type TagToPrimitiveType<P> = P extends { tags: readonly Tag[] }
  ? Includes<P['tags'], 'any'> extends true
    ? any
    : never
  : never

/**
 * @description The simple primitive type
 * @template P - The parameter
 * @returns The primitive type
 */
type SimplePrimitive<P> = P extends AbiParameter
  ? // Check if the parameter has a tag type
    TagToPrimitiveType<P> extends never
    ? // If not, transform the parameter to a primitive type
      AbiParameterToPrimitiveType<P> extends infer Primitive
      ? // Check if the primitive type is a bigint
        Primitive extends bigint
        ? // If it is, transform it to a string
          string
        : // Check if the primitive type is a bigint[]
          Primitive extends readonly bigint[]
          ? // If it is, transform it to a string[]
            string[]
          : // If not, return the primitive type
            Primitive
      : never
    : TagToPrimitiveType<P>
  : never

/**
 * @description The tuple utils
 * @template Components - The components
 * @returns The tuple utils
 */
type TupleUtils<Components extends readonly any[]> = {
  [N in Components[number]['name']]: ExtendedParameterToPrimitiveType<
    Extract<Components[number], { name: N }>
  >
}

/**
 * @description The tuple primitive type with recursive tuple types
 * @template P - The parameter
 * @returns The tuple primitive type
 */
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

/**
 * @description The main formatter
 * @template TParameter - The parameter
 * @template TUseTags - Whether to use tags
 * @returns The main formatter
 */
export type ExtendedParameterToPrimitiveType<
  TParameter,
  TUseTags extends boolean = true,
> = TUseTags extends true
  ? TuplePrimitive<TParameter> extends never
    ? SimplePrimitive<TParameter>
    : TuplePrimitive<TParameter>
  : TParameter extends AbiParameter
    ? AbiParameterToPrimitiveType<TParameter>
    : never

/**
 * @description Itterate over the parameters and format them to primitive types
 * @template TParameters - The parameters
 * @template TUseTags - Whether to use tags
 * @returns The parameters formatted to primitive types
 */
export type ExtendedParametersToPrimitiveType<
  TParameters,
  TUseTags extends boolean = true,
> = TUseTags extends true
  ? {
      [K in keyof TParameters]: ExtendedParameterToPrimitiveType<TParameters[K]>
    }
  : {
      [K in keyof TParameters]: TParameters[K] extends AbiParameter
        ? AbiParameterToPrimitiveType<TParameters[K]>
        : never
    }
