import { formatEther, type PublicClient } from 'viem'
import type {
  EstimateGasReturn,
  FactoryType,
  GetUserArgs,
  Inverter,
  PopWalletClient,
  RequestedModules,
} from '..'
import { getAbi, getViemMethods, handleError } from './utils'
import getArgs from './getArgs'

/**
 * Provides RPC interactions for the requested modules.
 */
export default async function getMethods<
  T extends RequestedModules,
  FT extends FactoryType,
>(params: {
  requestedModules: T
  factoryType: FT
  publicClient: PublicClient
  walletClient: PopWalletClient
  self?: Inverter
}) {
  const { publicClient, walletClient, requestedModules, factoryType } = params

  const abi = getAbi(factoryType)

  // Get the methods from the Viem handler
  const {
    write,
    simulateWrite,
    estimateGas: esitmateGasOrg,
  } = await getViemMethods({
    walletClient,
    publicClient,
    factoryType,
    abi,
    version: 'v0.2',
  })

  // Simulate the deployment
  const simulate = async (userArgs: GetUserArgs<T, FT>) => {
    try {
      const arr = await getArgs({ userArgs, kind: 'simulate', ...params })
      return await simulateWrite(arr, {
        account: walletClient.account.address,
      })
    } catch (e: any) {
      throw handleError(requestedModules, e)
    }
  }

  // Run the deployment = write
  const run = async (userArgs: GetUserArgs<T, FT>) => {
    try {
      const arr = await getArgs({ userArgs, kind: 'write', ...params })

      const simulationRes = await simulateWrite(arr, {
        account: walletClient.account.address,
      })

      const orchestratorAddress = simulationRes.result

      const transactionHash = await write(arr, {} as any)

      return {
        orchestratorAddress,
        transactionHash,
      }
    } catch (e: any) {
      throw handleError(requestedModules, e)
    }
  }

  // Estimate the gas for the deployment
  const estimateGas = async (
    userArgs: GetUserArgs<T, FT>
  ): Promise<EstimateGasReturn> => {
    try {
      const arr = await getArgs({ userArgs, kind: 'estimateGas', ...params })

      const value = String(
        await esitmateGasOrg(arr, {
          account: walletClient.account.address,
        })
      )

      const formatted = formatEther(BigInt(value))

      return {
        value,
        formatted,
      }
    } catch (e: any) {
      throw handleError(requestedModules, e)
    }
  }

  return { run, simulate, estimateGas }
}
