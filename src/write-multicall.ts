import { getModuleData } from '@inverter-network/abis'
import type { WriteMulticallParams, WriteMulticallReturnType } from './types'
import { getContract } from 'viem'

import d from 'debug'
import { handleErrorWithUnknownContext, handleOptions } from './utils'

const debug = d('inverter:sdk:multicall')

/**
 * @description Make multiple write transactions in a single call;
 * Note: The multicall can only be made by contract that implements TrustedForwarder_v1
 */
export async function writeMulticall({
  publicClient,
  walletClient,
  call,
  options = {
    confirmations: 1,
  },
  ...rest
}: WriteMulticallParams): Promise<WriteMulticallReturnType> {
  if (call.length === 0) {
    throw new Error('Call array cannot be empty')
  }

  let transactionHash: `0x${string}` = '0x'
  let statuses = Array(call.length).fill('fail' as 'fail' | 'success')
  let returnDatas = Array(call.length).fill('0x')

  try {
    const moduleData = getModuleData('Module_v1')

    const address =
      'trustedForwarderAddress' in rest
        ? rest.trustedForwarderAddress
        : await publicClient.readContract({
            address: rest.orchestratorAddress,
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

    transactionHash = await contract.write.executeMulticall([multicallData])

    await handleOptions.receipt({
      hash: transactionHash,
      options,
      publicClient,
    })

    const flatResult = result.flat()

    statuses = flatResult.map(({ success }) => (success ? 'success' : 'fail'))
    returnDatas = flatResult.map(({ returnData }) => returnData)

    // Return the hash for backwards compatibility
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
      console.error('Error in writeMulticall', e!)
      return {
        statuses,
        returnDatas,
        transactionHash,
      }
    }
  }
}
