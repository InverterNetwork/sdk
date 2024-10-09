import type { ModuleName } from '@inverter-network/abis'
import { getModuleData } from '@inverter-network/abis'
import { getContract } from 'viem'
import type { Abi } from 'viem'
import iterateMethods from './iterateMethods'

import type { GetModuleParams, PopWalletClient } from '@/types'

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
      extras,
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
      extras,
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
      extras,
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
          extras,
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
