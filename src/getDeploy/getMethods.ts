import { formatEther, type PublicClient } from 'viem'
import type {
  DeployMethodKind,
  FactoryType,
  GetUserArgs,
  Inverter,
  PopWalletClient,
  RequestedModules,
} from '..'
import { getViemMethods, handlePimFactoryApprove } from './utils'
import getArgs from './getArgs'
import { handleError } from '../utils'
import { getModuleData } from '@inverter-network/abis'

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

  const abi = {
    'restricted-pim': () => getModuleData('Restricted_PIM_Factory_v1').abi,
    'immutable-pim': () => getModuleData('Immutable_PIM_Factory_v1').abi,
    default: () => getModuleData('OrchestratorFactory_v1').abi,
  }[factoryType]()

  const {
    factoryAddress,
    write,
    simulateWrite,
    estimateGas: esitmateGasOrg,
  } = await getViemMethods({
    abi,
    walletClient,
    publicClient,
    factoryType,
    version: 'v1.0.0',
  })

  type Args = GetUserArgs<T, FT>

  async function handleDeployment<K extends DeployMethodKind>(
    userArgs: Args,
    kind: K
  ) {
    try {
      await handlePimFactoryApprove({
        factoryType,
        factoryAddress,
        publicClient,
        walletClient,
        userArgs,
      })

      const arr = await getArgs({ userArgs, kind, ...params })

      const actions = {
        simulate: async () => {
          const res = await simulateWrite(arr, {
            account: walletClient.account.address,
          })
          const orchestratorAddress = res.result as `0x${string}`
          return {
            result: orchestratorAddress,
            request: res.request,
          }
        },
        estimateGas: async () => {
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
        },
        write: async () => {
          const simulationRes = await simulateWrite(arr, {
            account: walletClient.account.address,
          })
          const orchestratorAddress = simulationRes.result as `0x${string}`
          const transactionHash = await write(arr, {} as any)
          return {
            orchestratorAddress,
            transactionHash,
          }
        },
      }

      const selected = actions[kind]

      const res = (await selected()) as Awaited<ReturnType<typeof selected>>

      return res
    } catch (e: any) {
      throw handleError({ requestedModules, error: e })
    }
  }

  return {
    run: (userArgs: Args) => handleDeployment(userArgs, 'write'),
    simulate: (userArgs: Args) => handleDeployment(userArgs, 'simulate'),
    estimateGas: (userArgs: Args) => handleDeployment(userArgs, 'estimateGas'),
  }
}
