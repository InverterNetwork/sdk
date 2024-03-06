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
  const mv = data[name][version]
  type T = typeof mv

  // Get the moduletype, abi, description, and methodMetas from the data object
  const moduleType = mv.moduleType as T['moduleType'],
    description = mv.description as T['description'],
    abi = mv.abi as T['abi']

  // Construct a contract object using the address and clients
  const contract = getContract({
    abi,
    address,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  })

  const read = prepare(abi, ['pure', 'view'], contract, extras),
    write = prepare(abi, ['nonpayable', 'payable'], contract, extras)

  return {
    name,
    version,
    address,
    moduleType,
    description,
    read,
    write,
  }
}
