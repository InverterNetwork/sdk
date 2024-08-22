import { formatEther, type PublicClient } from 'viem'
import {
  type EstimateGasReturn,
  type FactoryType,
  type GetUserArgs,
  type Inverter,
  type PopWalletClient,
  type RequestedModules,
} from '..'
import { getAbi, getViemMethods, handlePimFactoryApprove } from './utils'
import getArgs from './getArgs'
import { handleError } from '../utils'

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
    deployment,
    write,
    simulateWrite,
    estimateGas: esitmateGasOrg,
  } = await getViemMethods({
    walletClient,
    publicClient,
    factoryType,
    abi,
    version: 'v1.0.0',
  })

  // Simulate the deployment
  const simulate = async (userArgs: GetUserArgs<T, FT>) => {
    try {
      const arr = await getArgs({ userArgs, kind: 'simulate', ...params })
      return await simulateWrite(arr, {
        account: walletClient.account.address,
      })
    } catch (e: any) {
      throw handleError({ requestedModules, error: e })
    }
  }

  // Run the deployment = write
  const run = async (userArgs: GetUserArgs<T, FT>) => {
    try {
      await handlePimFactoryApprove({
        factoryType,
        deployment,
        publicClient,
        walletClient,
        userArgs,
      })

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
      throw handleError({ requestedModules, error: e })
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
      throw handleError({ requestedModules, error: e })
    }
  }

  return { run, simulate, estimateGas }
}
