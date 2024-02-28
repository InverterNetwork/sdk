/**
 * Create tuple of {@link Type} type with {@link Size} size
 *
 * @param Type - Type of tuple
 * @param Size - Size of tuple
 * @returns Tuple of {@link Type} type with {@link Size} size
 *
 * @example
 * type Result = Tuple<string, 2>
 * //   ^? type Result = [string, string]
 */
// https://github.com/Microsoft/TypeScript/issues/26223#issuecomment-674500430
export type UnionToTuple<Type, Size extends number> = Size extends Size
  ? number extends Size
    ? Type[]
    : _TupleOf<Type, Size, []>
  : never
type _TupleOf<
  TNumber,
  TSize extends number,
  R extends readonly unknown[],
> = R['length'] extends TSize
  ? R
  : _TupleOf<TNumber, TSize, readonly [TNumber, ...R]>
