import type { ModuleKeys, ModuleVersionKey } from '@inverter-network/abis'
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
import prepare from './utlis/prepare'
import { Extras } from './types/base'

export default function getModule<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
>({
  name,
  version,
  address,
  publicClient,
  walletClient,
  extras,
}: {
  name: K
  version: V
  address: Hex
  publicClient: PublicClient<Transport, Chain>
  walletClient: WalletClient<Transport, Chain, Account>
  extras?: Extras
}) {
  const moduleData = data[name][version]

  // Get the moduletype, abi, description, and methodMetas from the data object
  const { moduletype, abi, description, itterable } = moduleData

  // Construct a contract object using the address and clients
  const contract = getContract({
    abi,
    address,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  })

  const read = prepare(itterable, 'read', contract, extras),
    write = prepare(itterable, 'write', contract, extras)

  return {
    name,
    version,
    address,
    moduletype,
    description,
    read,
    write,
  }
}
