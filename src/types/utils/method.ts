import type { SimulateContractReturnType } from 'viem'
import type { ExtendedParametersToPrimitiveType } from './primitive'

export type MethodKind = 'read' | 'write' | 'simulate' | 'estimateGas'

export type EstimateGasReturn = {
  value: string
  formatted: string
}

// Decides on the arguments orders
export type GetMethodArgs<I> =
  ExtendedParametersToPrimitiveType<I> extends infer R extends
    readonly unknown[]
    ? R['length'] extends 0
      ? void
      : R['length'] extends 1
        ? R[0]
        : R
    : never

// Deduper util for getting the return type
type InferReturn<O> =
  ExtendedParametersToPrimitiveType<O> extends infer R
    ? R extends readonly unknown[]
      ? R['length'] extends 1
        ? R[0]
        : R
      : never
    : never

// Get the return type of the method, based on read, write or simulate
export type GetMethodResponse<O, T extends MethodKind> = T extends 'estimateGas'
  ? EstimateGasReturn
  : T extends 'simulate'
    ? { result: InferReturn<O>; request: SimulateContractReturnType['request'] }
    : T extends 'write'
      ? `0x${string}`
      : InferReturn<O>
