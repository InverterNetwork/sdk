// sdk types
import type {
  DeployMethodKind,
  GetDeployWorkflowArgs,
  GetMethodsParams,
  GetMethodsReturnType,
  MethodOptions,
  MixedRequestedModules,
} from '@/types'
// sdk utils
import { handleError, handleOptions } from '@/utils'
import {
  decodeEventLog,
  encodeFunctionData,
  formatEther,
  parseAbiItem,
} from 'viem'

import getArgs from './get-args'
// get-deploy utils
import { getFactoryAddress, getViemMethods } from './utils'

/**
 * @description Provides RPC interactions for the requested modules.
 */
export default async function getMethods<T extends MixedRequestedModules>(
  params: GetMethodsParams<T>
): Promise<GetMethodsReturnType<T>> {
  const { publicClient, walletClient, requestedModules } = params

  const {
    write,
    simulateWrite,
    estimateGas: esitmateGasOrg,
    factoryAddress,
    abi,
  } = await getViemMethods({
    walletClient,
    publicClient,
    version: 'v1.0.0',
  })

  type Args = GetDeployWorkflowArgs<T>

  async function handleDeployment<TMethodKind extends DeployMethodKind>(
    kind: TMethodKind,
    userArgs: Args,
    options?: MethodOptions
  ) {
    try {
      const arr = await getArgs({ userArgs, kind, ...params })

      async function handleSimulate() {
        {
          const res = await simulateWrite(arr, {
            account: walletClient.account.address,
          })
          const orchestratorAddress = res.result as `0x${string}`
          return {
            result: orchestratorAddress,
            request: res.request,
          }
        }
      }

      async function handleEstimateGas() {
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
      }

      async function handleWrite() {
        let orchestratorAddress = '' as `0x${string}`

        const transactionHash = await write(arr, {
          ...(options?.nonce ? { nonce: options.nonce } : {}),
        } as any)

        const eventAbi = parseAbiItem(
          'event OrchestratorCreated(uint256 indexed orchestratorId, address indexed orchestratorAddress)'
        )

        const receipt = await handleOptions.receipt({
          hash: transactionHash,
          options: {
            ...options,
            confirmations: options?.confirmations ?? 1,
          },
          publicClient,
        })

        if (!receipt) {
          throw new Error('Transaction receipt not found')
        }

        const defaltFactoryAddress = await getFactoryAddress({
          version: 'v1.0.0',
          chainId: publicClient.chain!.id,
        })

        if (!defaltFactoryAddress) {
          throw new Error('Default factory address not found')
        }

        const log = receipt.logs.find(
          (log) =>
            log.address.toLowerCase() === defaltFactoryAddress.toLowerCase()
        )

        if (log) {
          const { args } = decodeEventLog({
            abi: [eventAbi],
            data: log.data,
            topics: log.topics,
          })
          orchestratorAddress = args.orchestratorAddress
        } else {
          throw new Error('Expected event not found in transaction receipt')
        }

        return {
          orchestratorAddress,
          transactionHash,
        }
      }

      async function handleBytecode() {
        const { result: orchestratorAddress } = await handleSimulate()
        const bytecode = encodeFunctionData({
          abi,
          functionName: 'createOrchestrator',
          args: arr as any,
        })
        return {
          rawArgs: arr,
          bytecode,
          orchestratorAddress,
          factoryAddress,
        }
      }

      const actions = {
        simulate: handleSimulate,
        estimateGas: handleEstimateGas,
        write: handleWrite,
        bytecode: handleBytecode,
      }

      const selected = actions[kind]

      const res = (await selected()) as Awaited<ReturnType<typeof selected>>

      // TODO: Refactor this to not use any type
      return res as any
    } catch (e: any) {
      throw handleError({ requestedModules, error: e })
    }
  }

  return {
    run: (userArgs: Args, options?: MethodOptions) =>
      handleDeployment('write', userArgs, options),
    simulate: (userArgs: Args) => handleDeployment('simulate', userArgs),
    estimateGas: (userArgs: Args) => handleDeployment('estimateGas', userArgs),
    bytecode: (userArgs: Args) => handleDeployment('bytecode', userArgs),
  }
}
