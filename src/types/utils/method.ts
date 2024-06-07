import { AbiStateMutability } from 'abitype'
import { FormattedParametersToPrimitiveType } from './parameter'
import { TransactionReceipt, WaitForTransactionReceiptParameters } from 'viem'

export type NonSimulateWriteReturn = {
  hash: `0x${string}`
  waitForTransactionReceipt: (
    args?: Omit<WaitForTransactionReceiptParameters, 'hash'>
  ) => Promise<TransactionReceipt>
}

// Decides on the arguments orders
export type GetMethodArgs<I> =
  FormattedParametersToPrimitiveType<I> extends infer R extends
    readonly unknown[]
    ? R['length'] extends 0
      ? void
      : R['length'] extends 1
        ? R[0]
        : R
    : never

// Deduper util for getting the return type
type InferReturn<O> =
  FormattedParametersToPrimitiveType<O> extends infer R
    ? R extends readonly unknown[]
      ? R['length'] extends 1
        ? R[0]
        : R
      : never
    : never

// Get the return type of the method, based on read, write or simulate
export type GetMethodResponse<
  O,
  T extends AbiStateMutability,
  Simulate extends boolean = false,
> = Simulate extends true
  ? InferReturn<O>
  : T extends 'payable' | 'nonpayable'
    ? NonSimulateWriteReturn
    : InferReturn<O>
