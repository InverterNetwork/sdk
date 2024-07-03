import type { ModuleName } from '@inverter-network/abis'
import { getModuleData } from '@inverter-network/abis'
import { getContract } from 'viem'
import prepareFunction from './prepareFunction'
import { GetModuleParams, PopWalletClient } from '../types'

export default function getModule<
  N extends ModuleName,
  W extends PopWalletClient | undefined = undefined,
>({
  name,
  address,
  publicClient,
  walletClient,
  extras,
  self,
}: GetModuleParams<N, W>) {
  const mv = getModuleData(name)

  if (!mv) throw new Error(`Module ${name} was not found`)

  type MV = typeof mv

  // If the walletClient is valid add walletAddress to the extras-
  // this is used to simulate transactions with the wallet address
  if (!!walletClient)
    extras = { ...extras, walletAddress: walletClient.account.address }

  // Get the moduletype, abi, description, and methodMetas from the module version
  const moduleType = mv.moduleType as MV['moduleType'],
    description = mv.description as MV['description'],
    abi = mv.abi as MV['abi']

  // Construct the clients object and the contract object
  const client = {
      public: publicClient,
      wallet: walletClient,
    },
    contract = getContract({
      abi,
      address,
      client,
    })

  // Prepare the read functions
  const read = prepareFunction(
      publicClient,
      abi,
      ['pure', 'view'],
      contract,
      extras,
      // We need to pass simulate undefined to not override the default inputs to txHash
      undefined,
      self,
      walletClient
    ),
    // Prepare the simulate functions
    simulate = prepareFunction(
      publicClient,
      abi,
      ['nonpayable', 'payable'],
      contract,
      extras,
      true,
      self,
      walletClient
    ),
    // Prepare the write functions if the walletClient is valid
    write = !!walletClient
      ? prepareFunction(
          publicClient,
          abi,
          ['nonpayable', 'payable'],
          contract,
          extras,
          false,
          self,
          walletClient
        )
      : undefined

  // The result object, covers the whole module
  const result = {
    name,
    address,
    moduleType,
    description,
    read,
    simulate,
    write: write as W extends undefined ? never : NonNullable<typeof write>,
  }

  // Return the result object
  return result
}
