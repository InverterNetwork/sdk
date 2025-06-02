// external dependencies

// sdk types
import type { ExtendedParametersToPrimitiveType } from '@/index'
import type { SimulateContractReturnType, TransactionReceipt } from 'viem'

/**
 * @description The kind of methods
 */
export type MethodKind =
  | 'read'
  | 'write'
  | 'simulate'
  | 'estimateGas'
  | 'bytecode'

/**
 * @description The kind of deploy methods
 */
export type DeployMethodKind = 'write' | 'simulate' | 'estimateGas' | 'bytecode'

/**
 * @description The return type for the estimateGas method
 */
export type EstimateGasReturnType = {
  value: string
  formatted: string
}

/**
 * @description The parameters for the method
 * @template I - The inputs of the method
 * @returns The parameters for the method
 */
export type GetMethodParams<I> =
  ExtendedParametersToPrimitiveType<I> extends infer R extends
    readonly unknown[]
    ? R['length'] extends 0
      ? void
      : R['length'] extends 1
        ? R[0]
        : R
    : never

/**
 * The options for the method
 * @param {Object} MethodOptions
 * @param {number} [params.confirmations] - The number of confirmations
 * @param {Function} params.onHash - The callback for the hash ( if confirmations is specified to receive the hash pre await )
 * @param {Function} params.onApprove - The callback for the approval
 */
export type MethodOptions = {
  nonce?: number
  confirmations?: number
  onHash?: (hash: `0x${string}`) => void
  onConfirmation?: (receipt: TransactionReceipt) => void
  onApprove?: (receipts: TransactionReceipt[]) => void
  skipApprove?: boolean
}

// Deduper util for getting the return type
type InferReturn<O, TUseTags extends boolean = true> =
  ExtendedParametersToPrimitiveType<O, TUseTags> extends infer R
    ? R extends readonly unknown[]
      ? R['length'] extends 1
        ? R[0]
        : R
      : never
    : never

/**
 * @description The return type for the method
 * @template O - The outputs of the method
 * @template T - The kind of method
 * @template TUseTags - Whether auto parse inputs, outputs and approve allowances using tag configs
 * @returns The return type for the method
 */
export type GetMethodReturnType<
  O,
  T extends MethodKind,
  TUseTags extends boolean = true,
> = T extends 'estimateGas'
  ? EstimateGasReturnType
  : T extends 'simulate'
    ? {
        result: InferReturn<O, TUseTags>
        request: SimulateContractReturnType['request']
      }
    : T extends 'write' | 'bytecode'
      ? `0x${string}`
      : InferReturn<O, TUseTags>
