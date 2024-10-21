import { decodeEventLog, formatEther, parseAbiItem } from 'viem'
import type { PublicClient } from 'viem'
import type {
  DeployMethodKind,
  FactoryType,
  GetUserArgs,
  Inverter,
  MethodOptions,
  PopWalletClient,
  RequestedModules,
} from '..'
import { getViemMethods, handlePimFactoryApprove } from './utils'
import getArgs from './getArgs'
import { handleError, handleOptions } from '../utils'
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

          if (factoryType === 'immutable-pim') {
            const simulationRes = await simulateWrite(arr, {
              account: walletClient.account.address,
            })
            orchestratorAddress = simulationRes.result as `0x${string}`
          }

          const factoryTypeGuard = (
            factoryType: FT
          ): factoryType is Exclude<FT, 'immutable-pim'> =>
            factoryType !== 'immutable-pim'

          const transactionHash = await write(arr, {} as any)

          if (factoryTypeGuard(factoryType)) {
            const eventAbi = {
              'restricted-pim': () =>
                parseAbiItem(
                  'event PIMWorkflowCreated(address indexed orchestrator, address indexed issuanceToken, address indexed beneficiary)'
                ),
              default: () =>
                parseAbiItem(
                  'event OrchestratorCreated(uint256 indexed orchestratorId, address indexed orchestratorAddress)'
                ),
            }

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

            const log = receipt.logs.find(
              (log) =>
                log.address.toLowerCase() === factoryAddress.toLowerCase()
            )

            if (log) {
              switch (factoryType) {
                case 'restricted-pim':
                  const { args } = decodeEventLog({
                    abi: [eventAbi['restricted-pim']()],
                    data: log.data,
                    topics: log.topics,
                  })
                  orchestratorAddress = args.orchestrator
                  break
                case 'default':
                  const { args: args2 } = decodeEventLog({
                    abi: [eventAbi.default()],
                    data: log.data,
                    topics: log.topics,
                  })
                  orchestratorAddress = args2.orchestratorAddress
                  break
              }
            } else {
              throw new Error('Expected event not found in transaction receipt')
            }
          }

          // handle options receipt
          if (!factoryTypeGuard(factoryType)) {
            await handleOptions.receipt({
              hash: transactionHash,
              options,
              publicClient,
            })
          }

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
    run: (userArgs: Args, options?: MethodOptions) =>
      handleDeployment('write', userArgs, options),
    simulate: (userArgs: Args) => handleDeployment('simulate', userArgs),
    estimateGas: (userArgs: Args) => handleDeployment('estimateGas', userArgs),
  }
}
