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

// EXPORT
// --------------------------------------------------------------------------------

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

// MAIN FUNCTIONS
// --------------------------------------------------------------------------------

/**
 * @description Component function for making multiple write transactions in a single call.
 */
async function writeMulticallFnComponent(
  { publicClient, walletClient, calls, ...rest }: ModuleMulticallParams,
  options: MethodOptions = {
    confirmations: 1,
  }
): Promise<ModuleMulticallWriteReturnType> {
  // Initialize the transaction hash, statuses, and return datas
  let transactionHash: `0x${string}` = '0x'
  let statuses: ('fail' | 'success')[] = []
  let returnDatas: `0x${string}`[] = []

  try {
    // Get the contract, multicall data, statuses, and return datas from the multicall core
    const {
      contract,
      multicallData,
      statuses: initialStatuses,
      returnDatas: initialReturnDatas,
    } = await multicallCore({
      publicClient,
      walletClient,
      calls,
      ...rest,
    })
    // Set the statuses and return datas to the initial values
    statuses = initialStatuses
    returnDatas = initialReturnDatas
    // Execute the actual write transaction
    transactionHash = await contract.write.executeMulticall([multicallData], {
      account: walletClient?.account.address,
    })
    // Handle the receipt of the transaction
    await handleOptions.receipt({
      hash: transactionHash,
      options,
      publicClient,
    })
    // Log the transaction hash
    debug('MULTICALL WRITE_TRANSACTION_HASH:', transactionHash)
    // Return the result
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
  calls,
  ...rest
}: ModuleMulticallParams): Promise<ModuleMulticallSimulateReturnType> {
  // Initialize the statuses and return datas - so they can be returned if an error occurs
  let statuses: ('fail' | 'success')[] = []
  let returnDatas: `0x${string}`[] = []

  try {
    // Get the statuses and return datas from the multicall core
    ;({ statuses, returnDatas } = await multicallCore({
      publicClient,
      walletClient,
      calls,
      ...rest,
    }))
    // Return the statuses and return datas
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

// HELPER FUNCTIONS
// --------------------------------------------------------------------------------

/**
 * @description Core function to handle shared logic between multicall operations
 */
async function multicallCore({
  publicClient,
  walletClient,
  calls,
  ...rest
}: ModuleMulticallParams): Promise<{
  statuses: ('fail' | 'success')[]
  returnDatas: `0x${string}`[]
  contract: any
  multicallData: any[]
}> {
  // Check if the call array is empty - if so, throw an error
  // This is to prevent accidental calls to the transaction forwarder
  if (calls.length === 0) {
    throw new Error('Call array cannot be empty')
  }
  // Initialize the statuses and return datas
  let statuses = Array(calls.length).fill('fail' as 'fail' | 'success')
  let returnDatas = Array(calls.length).fill('0x')
  // Get the address of the transaction forwarder
  const moduleData = getModuleData('Module_v1')
  const address =
    'trustedForwarderAddress' in rest
      ? rest.trustedForwarderAddress
      : await publicClient.readContract({
          address: rest.orchestratorAddress,
          abi: moduleData.abi,
          functionName: 'trustedForwarder',
        })
  // Get the module data for the transaction forwarder
  const transactionForwarderModuleData = getModuleData(
    'TransactionForwarder_v1'
  )
  // Get the contract instance for the transaction forwarder
  const contract = getContract({
    address,
    abi: transactionForwarderModuleData.abi,
    client: { public: publicClient, wallet: walletClient },
  })
  // Map the call data to be compatible with the transaction forwarder
  const multicallData = calls.map(({ address, callData, allowFailure }) => {
    return {
      target: address,
      callData,
      allowFailure,
    } as const
  })
  // Log the call data
  debug(
    'MULTICALL CALL_DATA:',
    multicallData.map((i) => ({
      ...i,
      callData: i.callData.slice(0, 100) + '...',
    }))
  )
  // Simulate the call
  const { result } = await contract.simulate.executeMulticall([multicallData], {
    account: walletClient?.account?.address,
  })
  // Flatten the result and map the statuses and return datas
  const flatResult = result.flat() as SimulationResultItem[]
  statuses = flatResult.map(({ success }: SimulationResultItem) =>
    success ? 'success' : 'fail'
  )
  returnDatas = flatResult.map(
    ({ returnData }: SimulationResultItem) => returnData
  )
  // Log the simulation result
  debug('MULTICALL SIMULATION_RESULT:', { statuses, returnDatas })
  return {
    statuses,
    returnDatas,
    contract,
    multicallData,
  }
}
