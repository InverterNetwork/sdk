import { AbiStateMutability } from 'abitype'
import { FormattedParametersToPrimitiveType } from './parameter'

export type MethodArgs<I> =
  FormattedParametersToPrimitiveType<I> extends infer R extends
    readonly unknown[]
    ? R['length'] extends 0
      ? void
      : R['length'] extends 1
        ? R[0]
        : R
    : never

export type MethodReturn<O, T extends AbiStateMutability> = T extends
  | 'payable'
  | 'nonpayable'
  ? `0x${string}`
  : FormattedParametersToPrimitiveType<O> extends infer R extends
        readonly unknown[]
    ? R['length'] extends 1
      ? R[0]
      : R
    : never
