import { getModule } from './get-module'
import { getModuleData } from '@inverter-network/abis'
import type { MulticallParams } from './types'

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

  const transactionForwarder = getModule({
    address,
    publicClient,
    walletClient,
    name: 'TransactionForwarder_v1',
  })

  const result = await transactionForwarder.write.executeMulticall.run(
    call.map(({ address, callData, allowFailure }) => ({
      target: address,
      callData,
      allowFailure,
    }))
  )

  // TODO: return success / failure array
  // {
  //   statuses: 'success' | 'failure'[],
  //   transactionHash: `0x${string}`,
  // }

  return result
}
