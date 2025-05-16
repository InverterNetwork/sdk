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

  const multicallData = call.map(
    ({ address, callData, allowFailure }) =>
      ({
        target: address,
        callData,
        allowFailure,
      }) as const
  )

  debug('multicallData', multicallData)

  const result = await contract.write.executeMulticall([multicallData])

  // TODO: return success / failure array
  // {
  //   statuses: 'success' | 'failure'[],
  //   transactionHash: `0x${string}`,
  // }

  return result
}
