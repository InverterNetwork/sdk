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
 * @template TModuleName - The module name
 * @template TModuleData - The module data
 * @template TWalletClient - The wallet client
 * @param params - The parameters for the module
 * @returns The module
 */
export function getModule<
  TModuleName extends TModuleData extends ModuleData ? never : ModuleName,
  TWalletClient extends PopWalletClient | undefined = undefined,
  TModuleData extends ModuleData | undefined = undefined,
>({
  address,
  publicClient,
  walletClient,
  tagConfig,
  self,
  moduleData: mD,
  ...rest
}: GetModuleParams<
  TModuleName,
  TWalletClient,
  TModuleData
>): GetModuleReturnType<TModuleName, TWalletClient, TModuleData> {
  if (!mD && !(rest as any).name)
    throw new Error('Module name is required when moduleData is not provided')

  const moduleData = mD ?? getModuleData((rest as any).name)

  if (!moduleData)
    throw new Error(`Module ${(moduleData as any).name} was not found`)

  type MD = TModuleData extends undefined
    ? GetModuleData<TModuleName>
    : NonNullable<TModuleData>

  const name = moduleData.name as MD['name']

  // If the walletClient is valid add walletAddress to the extras-
  // this is used to simulate transactions with the wallet address
  if (!!walletClient)
    tagConfig = { ...tagConfig, walletAddress: walletClient.account.address }

  // Get the moduletype, abi, description, and methodMetas from the module version
  const moduleType = moduleData.moduleType as MD['moduleType']
  const description = moduleData.description as MD['description']
  const abi = moduleData.abi as MD['abi']

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
    write: write as TWalletClient extends undefined
      ? never
      : NonNullable<typeof write>,
  }

  // Return the result object
  return result
}
