import { getModuleData } from '@inverter-network/abis'
import d from 'debug'
import { getContract } from 'viem'

import type {
  MethodOptions,
  ModuleMulticall,
  ModuleMulticallParams,
  ModuleMulticallSimulateReturnType,
  ModuleMulticallWriteReturnType,
} from './types'
import { handleErrorWithUnknownContext, handleOptions } from './utils'

const debug = d('inverter:sdk:multicall')

// Define a type for the simulation result items
type SimulationResultItem = {
  success: boolean
  returnData: `0x${string}`
}

/**
 * @description Core function to handle shared logic between multicall operations
 */
async function multicallCore({
  publicClient,
  walletClient,
  call,
  ...rest
}: ModuleMulticallParams): Promise<{
  statuses: ('fail' | 'success')[]
  returnDatas: `0x${string}`[]
  contract: any
  multicallData: any[]
}> {
  if (call.length === 0) {
    throw new Error('Call array cannot be empty')
  }

  let statuses = Array(call.length).fill('fail' as 'fail' | 'success')
  let returnDatas = Array(call.length).fill('0x')

  const moduleData = getModuleData('Module_v1')
  const address =
    'trustedForwarderAddress' in rest
      ? rest.trustedForwarderAddress
      : await publicClient.readContract({
          address: rest.orchestratorAddress,
          abi: moduleData.abi,
          functionName: 'trustedForwarder',
        })

  const transactionForwarderModuleData = getModuleData(
    'TransactionForwarder_v1'
  )

  const contract = getContract({
    address,
    abi: transactionForwarderModuleData.abi,
    client: { public: publicClient, wallet: walletClient },
  })

  const multicallData = call.map(({ address, callData, allowFailure }) => {
    debug('processing call for address', address)

    return {
      target: address,
      callData,
      allowFailure,
    } as const
  })

  debug('final multicallData', multicallData)

  return {
    statuses,
    returnDatas,
    contract,
    multicallData,
  }
}

/**
 * @description Component function for making multiple write transactions in a single call.
 */
async function writeMulticallFnComponent(
  { publicClient, walletClient, call, ...rest }: ModuleMulticallParams,
  options: MethodOptions = {
    confirmations: 1,
  }
): Promise<ModuleMulticallWriteReturnType> {
  let transactionHash: `0x${string}` = '0x'
  let statuses: ('fail' | 'success')[] = []
  let returnDatas: `0x${string}`[] = []

  try {
    const {
      contract,
      multicallData,
      statuses: initialStatuses,
      returnDatas: initialReturnDatas,
    } = await multicallCore({
      publicClient,
      walletClient,
      call,
      ...rest,
    })

    statuses = initialStatuses
    returnDatas = initialReturnDatas

    // First, simulate the call to ensure it's likely to succeed and get results
    const { result: simulateResult } = await contract.simulate.executeMulticall(
      [multicallData],
      {
        account: walletClient?.account.address,
      }
    )

    debug('Multicall simulation result', simulateResult)

    // Execute the actual write transaction
    transactionHash = await contract.write.executeMulticall([multicallData], {
      account: walletClient?.account.address,
    })

    await handleOptions.receipt({
      hash: transactionHash,
      options,
      publicClient,
    })

    const flatResult = simulateResult.flat() as SimulationResultItem[]
    statuses = flatResult.map(({ success }: SimulationResultItem) =>
      success ? 'success' : 'fail'
    )
    returnDatas = flatResult.map(
      ({ returnData }: SimulationResultItem) => returnData
    )

    return {
      statuses,
      returnDatas,
      transactionHash,
    }
  } catch (error) {
    let e: Error
    try {
      e = handleErrorWithUnknownContext(error)
    } catch (finalError) {
      e = finalError as Error
    } finally {
      console.error('Error in writeMulticall.write', e!)
      return {
        statuses,
        returnDatas,
        transactionHash,
      }
    }
  }
}

/**
 * @description Component function for simulating multiple write transactions in a single call.
 */
async function simulateMulticallFnComponent({
  publicClient,
  walletClient,
  call,
  ...rest
}: ModuleMulticallParams): Promise<ModuleMulticallSimulateReturnType> {
  let statuses: ('fail' | 'success')[] = []
  let returnDatas: `0x${string}`[] = []

  try {
    const {
      contract,
      multicallData,
      statuses: initialStatuses,
      returnDatas: initialReturnDatas,
    } = await multicallCore({
      publicClient,
      walletClient,
      call,
      ...rest,
    })

    statuses = initialStatuses
    returnDatas = initialReturnDatas

    const { result } = await contract.simulate.executeMulticall(
      [multicallData],
      {
        account: walletClient?.account?.address,
      }
    )

    const flatResult = result.flat() as SimulationResultItem[]
    statuses = flatResult.map(({ success }: SimulationResultItem) =>
      success ? 'success' : 'fail'
    )
    returnDatas = flatResult.map(
      ({ returnData }: SimulationResultItem) => returnData
    )

    debug('Multicall simulation result', { statuses, returnDatas })

    return {
      statuses,
      returnDatas,
    }
  } catch (error) {
    let e: Error
    try {
      e = handleErrorWithUnknownContext(error)
    } catch (finalError) {
      e = finalError as Error
    }
    console.error('Error in writeMulticall.simulate', e!)
    return {
      statuses,
      returnDatas,
    }
  }
}

/**
 * @description The module multicall object
 * @param params.call - The call to be made
 * @param params.options - The options for the call
 * @param params.rest - The rest of the parameters
 * @returns The statuses, return datas, and transaction hash
 *  * @example
 * ```ts
 * const { statuses, returnDatas, transactionHash } = await moduleMulticall.write({
 *   call,
 *   options,
 *   ...rest,
 * })
 * ```
 */
export const moduleMulticall: ModuleMulticall = {
  write: writeMulticallFnComponent,
  simulate: simulateMulticallFnComponent,
}
