import type { PopPublicClient, PopWalletClient } from '..'

/**
 * @description Single call to be executed in a batch
 * @param address The address of the contract to call
 * @param callData The data to call the contract with
 * @param allowFailure Whether the call is allowed to fail
 */
export type SingleCall = {
  address: `0x${string}`
  callData: `0x${string}`
  allowFailure: boolean
}

/**
 * @description Batch call to be executed
 */
export type Multicall = SingleCall[]

/**
 * @description The parameters for the batch call
 */
export type MulticallParams = {
  walletClient: PopWalletClient
  publicClient: PopPublicClient
  orchestratorAddress: `0x${string}`
  call: Multicall
}

/**
 * @description The result of a multicall operation
 */
export type MulticallReturnType = {
  statuses: Array<'success' | 'fail'>
  transactionHash: `0x${string}`
}
