import { getModuleData } from '@inverter-network/abis'
import type { WriteMulticallParams, WriteMulticallReturnType } from './types'
import { getContract } from 'viem'

import d from 'debug'

const debug = d('inverter:sdk:multicall')

/**
 * @description Make multiple write transactions in a single call;
 * Note: The multicall can only be made by contract that implements TrustedForwarder_v1
 */
export async function writeMulticall({
  publicClient,
  walletClient,
  orchestratorAddress,
  call,
}: WriteMulticallParams): Promise<WriteMulticallReturnType> {
  if (call.length === 0) {
    throw new Error('Call array cannot be empty')
  }
  try {
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

    const { result } = await contract.simulate.executeMulticall(
      [multicallData],
      {
        account: walletClient?.account.address,
      }
    )

    const transactionHash = await contract.write.executeMulticall([
      multicallData,
    ])

    await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    })

    // Return the hash for backwards compatibility
    return {
      statuses: result
        .flat()
        .map(({ success }) => (success ? 'success' : 'fail')),
      transactionHash,
    }
  } catch (error) {
    console.error('Error in multicall', error)
    return {
      statuses: Array(call.length).fill('fail' as 'fail' | 'success'),
      transactionHash: '0x',
    }
  }
}
