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

export default function getModule<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
>({
  name,
  version,
  address,
  publicClient,
  walletClient,
}: {
  name: K
  version: V
  address: Hex
  publicClient: PublicClient<Transport, Chain>
  walletClient: WalletClient<Transport, Chain, Account>
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

  const read = prepare(itterable, 'read', contract),
    write = prepare(itterable, 'write', contract)

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
