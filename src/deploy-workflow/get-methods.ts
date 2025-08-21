// sdk types
import type {
  DeployMethodKind,
  GetDeployWorkflowArgs,
  GetDeployWorkflowMethodsParams,
  GetDeployWorkflowMethodsReturnType,
  MethodOptions,
  MixedRequestedModules,
} from '@/types'
// sdk utils
import { handleError, handleOptions } from '@/utils'
import d from 'debug'
import {
  decodeEventLog,
  encodeFunctionData,
  formatEther,
  parseAbiItem,
} from 'viem'

import getArgs from './get-args'
// get-deploy utils
import { getFactoryAddress, getViemMethods } from './utils'

const debug = d('inverter:sdk:deploy-workflow:get-methods')

/**
 * @description Provides RPC interactions for the requested modules.
 * @template TRequestedModules - The requested modules
 */
export default async function getMethods<
  TRequestedModules extends MixedRequestedModules,
  TUseTags extends boolean = true,
>(
  params: GetDeployWorkflowMethodsParams<TRequestedModules, TUseTags>
): Promise<GetDeployWorkflowMethodsReturnType<TRequestedModules, TUseTags>> {
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

  type Args = GetDeployWorkflowArgs<TRequestedModules, TUseTags>

  async function handleDeployment<TMethodKind extends DeployMethodKind>(
    kind: TMethodKind,
    userArgs: Args,
    options?: MethodOptions
  ) {
    try {
      const arr = await getArgs({ userArgs, kind, ...params })

      async function handleSimulate() {
        debug(
          'SIMULATING WORKFLOW DEPLOYMENT:',
          getRequestedModulesString(requestedModules)
        )
        const res = await simulateWrite(arr, {
          account: walletClient.account.address,
        })
        const orchestratorAddress = res.result as `0x${string}`
        return {
          result: orchestratorAddress,
          request: res.request,
        }
      }

      async function handleEstimateGas() {
        debug(
          'ESTIMATING GAS FOR WORKFLOW DEPLOYMENT:',
          getRequestedModulesString(requestedModules)
        )
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
        debug(
          'WRITING WORKFLOW DEPLOYMENT:',
          getRequestedModulesString(requestedModules)
        )

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
        debug(
          'GENERATING BYTECODE FOR WORKFLOW DEPLOYMENT:',
          getRequestedModulesString(requestedModules)
        )

        const bytecode = encodeFunctionData({
          abi,
          functionName: 'createOrchestrator',
          args: arr as any,
        })
        return {
          rawArgs: arr,
          bytecode,
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

const getRequestedModulesString = (requestedModules: MixedRequestedModules) => {
  const result: string[] = []

  Object.keys(requestedModules).map((key) => {
    const value = requestedModules[key as keyof MixedRequestedModules]
    if (typeof value === 'string') {
      result.push(value)
    } else if (Array.isArray(value)) {
      value.forEach((v) => {
        if (typeof v === 'object') {
          result.push(v.name)
        } else {
          result.push(v)
        }
      })
    } else if (typeof value === 'object') {
      result.push(value.name)
    }
  })

  return result.join(',')
}
