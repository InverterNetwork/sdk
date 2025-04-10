// external dependencies
import type { GetModuleData, ModuleName } from '@inverter-network/abis'
import { getModuleData } from '@inverter-network/abis'
import { getContract } from 'viem'
import type { Abi } from 'viem'

// sdk types
import type {
  GetModuleParams,
  GetModuleReturnType,
  ModuleData,
  PopWalletClient,
} from '@/types'

// get-module utils
import iterateMethods from './iterate-methods'

/**
 * @description Constructs a Inverter module
 * @param params - The parameters for the module
 * @returns The module
 */
export function getModule<
  N extends MD extends ModuleData ? never : ModuleName,
  W extends PopWalletClient | undefined = undefined,
  MD extends ModuleData | undefined = undefined,
>({
  address,
  publicClient,
  walletClient,
  tagConfig,
  self,
  moduleData,
  ...rest
}: GetModuleParams<N, W, MD>): GetModuleReturnType<N, W, MD> {
  if (!moduleData && !(rest as any).name)
    throw new Error('Module name is required when moduleData is not provided')

  const mv = moduleData ?? getModuleData((rest as any).name)

  if (!mv) throw new Error(`Module ${(mv as any).name} was not found`)

  type MV = MD extends undefined ? GetModuleData<N> : NonNullable<MD>
  const name = mv.name as MV['name']

  // If the walletClient is valid add walletAddress to the extras-
  // this is used to simulate transactions with the wallet address
  if (!!walletClient)
    tagConfig = { ...tagConfig, walletAddress: walletClient.account.address }

  // Get the moduletype, abi, description, and methodMetas from the module version
  const moduleType = mv.moduleType as MV['moduleType']
  const description = mv.description as MV['description']
  const abi = mv.abi as MV['abi']

  const contract = getContract({
    abi: abi as Abi,
    address,
    client: {
      public: publicClient,
      wallet: walletClient!,
    },
  })

  // Prepare the read functions
  const read = iterateMethods({
      publicClient,
      abi,
      type: ['pure', 'view'],
      contract,
      tagConfig,
      // We need to pass simulate undefined to not override the default inputs to txHash
      kind: 'read',
      self,
      walletClient,
    }),
    // Prepare the simulate functions
    simulate = iterateMethods({
      publicClient,
      abi,
      type: ['nonpayable', 'payable'],
      contract,
      tagConfig,
      kind: 'simulate',
      self,
      walletClient,
    }),
    // Prepare estimateGas functions
    estimateGas = iterateMethods({
      publicClient,
      abi,
      type: ['nonpayable', 'payable'],
      contract,
      tagConfig,
      kind: 'estimateGas',
      self,
      walletClient,
    }),
    // Prepare the write functions if the walletClient is valid
    write = !!walletClient
      ? iterateMethods({
          publicClient,
          abi,
          type: ['nonpayable', 'payable'],
          contract,
          tagConfig,
          kind: 'write',
          self,
          walletClient,
        })
      : undefined

  // The result object, covers the whole module
  const result = {
    name,
    address,
    moduleType,
    description,
    read,
    simulate,
    estimateGas,
    write: write as W extends undefined ? never : NonNullable<typeof write>,
  }

  // Return the result object
  return result
}
