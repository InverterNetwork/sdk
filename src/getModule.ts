import type { AbiKey, AbiVersionKey } from '@inverter-network/abis'
import { data } from '@inverter-network/abis'
import { getContract } from 'viem'
import type {
  Hex,
  PublicClient,
  WalletClient,
  Chain,
  Transport,
  Account,
} from 'viem'
import getAbiMethodMetas, { AbiMethodMeta } from './utlis/getAbiMethodMetas'
import formatMethodStruct, { MethodStruct } from './utlis/formatMethodStruct'

export default function getModule<
  N extends AbiKey,
  V extends keyof (typeof data)[N],
>({
  name,
  version,
  address,
  publicClient,
  walletClient,
}: {
  name: N
  version: V
  address: Hex
  publicClient: PublicClient<Transport, Chain>
  walletClient: WalletClient<Transport, Chain, Account>
}) {
  // Get the moduletype, abi, description, and methodMetas from the data object
  const { moduletype, abi, description, methodMetas } =
    data[name][version as AbiVersionKey]

  // Construct a contract object using the address and clients
  const contract = getContract({
    abi,
    address,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  })

  // Get the abiMethodMetas from the abi
  const abiMethodMetas = getAbiMethodMetas(abi)

  // Create a methods object
  const methods = <Record<AbiMethodMeta['name'], MethodStruct>>{}

  // Iterate over the abiMethodMetas and add them to the methods object
  abiMethodMetas.forEach((meta) => {
    methods[meta.name] = formatMethodStruct({
      ...meta,
      contract,
      methodMeta: methodMetas[meta.name],
    })
  })

  return {
    name,
    version,
    address,
    moduletype,
    description,
    methods,
  }
}
