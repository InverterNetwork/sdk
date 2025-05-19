import type { MethodOptions, PopPublicClient, PopWalletClient } from '..'

/**
 * @description Single call to be executed in a batch
 * @param address The address of the contract to call
 * @param callData The data to call the contract with
 * @param allowFailure Whether the call is allowed to fail
 */
export type SingleModuleCall = {
  address: `0x${string}`
  callData: `0x${string}`
  allowFailure: boolean
}

/**
 * @description Batch call to be executed
 */
export type ModuleMulticallCall = SingleModuleCall[]

type ModuleMulticallCallBaseParams = {
  walletClient: PopWalletClient
  publicClient: PopPublicClient
  call: ModuleMulticallCall
}

/**
 * @description The parameters for the batch call
 */
export type ModuleMulticallParams = ModuleMulticallCallBaseParams &
  (
    | {
        orchestratorAddress: `0x${string}`
      }
    | {
        trustedForwarderAddress: `0x${string}`
      }
  )

/**
 * @description The result of a multicall operation
 * @param statuses - The statuses of the calls failed or succeeded
 * @param returnDatas - The return data of the calls
 * @param transactionHash - The hash of the transaction
 */
export type ModuleMulticallWriteReturnType = {
  statuses: Array<'success' | 'fail'>
  returnDatas: `0x${string}`[]
  transactionHash: `0x${string}`
}

export type ModuleMulticallSimulateReturnType = {
  statuses: Array<'success' | 'fail'>
  returnDatas: `0x${string}`[]
}

export type ModuleMulticall = {
  write: (
    params: ModuleMulticallParams,
    options?: MethodOptions
  ) => Promise<ModuleMulticallWriteReturnType>
  simulate: (
    params: ModuleMulticallParams
  ) => Promise<ModuleMulticallSimulateReturnType>
}
