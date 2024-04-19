import { AbiStateMutability } from 'abitype'
import { FormattedParametersToPrimitiveType } from './parameter'

export type GetMethodArgs<I> =
  FormattedParametersToPrimitiveType<I> extends infer R extends
    readonly unknown[]
    ? R['length'] extends 0
      ? void
      : R['length'] extends 1
        ? R[0]
        : R
    : never

type InferReturn<O> =
  FormattedParametersToPrimitiveType<O> extends infer R
    ? R extends readonly unknown[]
      ? R['length'] extends 1
        ? R[0]
        : R
      : never
    : never

export type GetMethodResponse<
  O,
  T extends AbiStateMutability,
  Simulate extends boolean = false,
> = Simulate extends true
  ? InferReturn<O>
  : T extends 'payable' | 'nonpayable'
    ? `0x${string}`
    : InferReturn<O>
