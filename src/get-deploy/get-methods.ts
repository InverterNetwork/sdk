import { decodeEventLog, formatEther, parseAbiItem } from 'viem'
import type {
  DeployMethodKind,
  FactoryType,
  GetMethodsParams,
  GetMethodsReturnType,
  GetUserArgs,
  MethodOptions,
  RequestedModules,
} from '..'
import {
  getFactoryAddress,
  getViemMethods,
  handlePimFactoryApprove,
} from './utils'
import getArgs from './get-args'
import { handleError, handleOptions } from '../utils'
import { getModuleData } from '@inverter-network/abis'

/**
 * Provides RPC interactions for the requested modules.
 */
export default async function getMethods<
  T extends RequestedModules,
  FT extends FactoryType,
>(params: GetMethodsParams<T, FT>): Promise<GetMethodsReturnType<T, FT>> {
  const { publicClient, walletClient, requestedModules, factoryType } = params

  const abi = {
    'restricted-pim': () => getModuleData('Restricted_PIM_Factory_v1').abi,
    'immutable-pim': () => getModuleData('Immutable_PIM_Factory_v1').abi,
    'migrating-pim': () => getModuleData('Migrating_PIM_Factory_v1').abi,
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
    kind: K,
    userArgs: Args,
    options?: MethodOptions
  ) {
    try {
      const receipts = await handlePimFactoryApprove({
        factoryType,
        factoryAddress,
        publicClient,
        walletClient,
        userArgs,
      })

      if (receipts) options?.onApprove?.(receipts)

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
            factoryType: 'default',
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
        },
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
  }
}
