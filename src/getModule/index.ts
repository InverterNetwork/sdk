import type { ModuleName, GetModuleVersion } from '@inverter-network/abis'
import { getModuleData } from '@inverter-network/abis'
import { getContract } from 'viem'
import type { Hex } from 'viem'
import prepareFunction from './prepareFunction'
import { Extras } from '../types/base'
import { PopPublicClient, PopWalletClient } from '../types'

export default function getModule<
  N extends ModuleName,
  V extends GetModuleVersion<N>,
  W extends PopWalletClient | undefined = undefined,
>({
  name,
  version,
  address,
  publicClient,
  walletClient,
  extras,
}: {
  name: N
  version: V
  address: Hex
  publicClient: PopPublicClient
  walletClient?: W
  extras?: Extras
}) {
  const mv = getModuleData(name, version)

  if (!mv) throw new Error(`Module ${name} with version ${version} not found`)

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
      extras
    ),
    // Prepare the simulate functions
    simulate = prepareFunction(
      publicClient,
      abi,
      ['nonpayable', 'payable'],
      contract,
      extras,
      true
    ),
    // Prepare the write functions if the walletClient is valid
    write = !!walletClient
      ? prepareFunction(
          publicClient,
          abi,
          ['nonpayable', 'payable'],
          contract,
          extras,
          false
        )
      : undefined

  // The result object, covers the whole module
  const result = {
    name,
    version,
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
