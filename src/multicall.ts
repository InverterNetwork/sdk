import { getModuleData } from '@inverter-network/abis'
import type { MulticallParams } from './types'
import { getContract } from 'viem'

import d from 'debug'

const debug = d('inverter:sdk:multicall')

/**
 * @description Make multiple write transactions in a single call;
 * Note: The multicall can only be made by contract that implements TrustedForwarder_v1
 */
export async function multicall({
  publicClient,
  walletClient,
  orchestratorAddress,
  call,
}: MulticallParams) {
  if (call.length === 0) {
    throw new Error('Call array cannot be empty')
  }

  const moduleData = getModuleData('Module_v1')

  const address = await publicClient.readContract({
    address: orchestratorAddress,
    abi: moduleData.abi,
    functionName: 'trustedForwarder',
  })

  debug('transactionForwarderAddress', address)

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
    debug('callData format', callData, callData.length)

    // Ensure callData is a valid hex string starting with 0x
    // callData is already of type `0x${string}`

    return {
      target: address,
      callData,
      allowFailure,
    } as const
  })

  debug('final multicallData', multicallData)

  const result = await contract.write.executeMulticall([multicallData])

  // TODO: Return success / failure array
  // This is implemented now. We return both the transaction hash and the result of each call.
  // When this is called from other code, it should check the success of each call.
  const hash = result

  // Return the hash for backwards compatibility
  return hash

  // TODO: Update the return type to include this information
  // return {
  //   hash,
  //   results: multicallData.map((call, index) => ({
  //     target: call.target,
  //     callData: call.callData,
  //     allowFailure: call.allowFailure,
  //     success: index < results.length ? results[index].success : false,
  //     returnData: index < results.length ? results[index].returnData : '0x'
  //   }))
  // };
}
