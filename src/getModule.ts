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
import { ExtrasProp } from './types/base'

export default function getModule<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
>({
  name,
  version,
  address,
  publicClient,
  walletClient,
  extrasProp,
}: {
  name: K
  version: V
  address: Hex
  publicClient: PublicClient<Transport, Chain>
  walletClient: WalletClient<Transport, Chain, Account>
  extrasProp?: ExtrasProp
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

  // const t = await contract.read.getClaimInformation([1n])

  const read = prepare(itterable, 'read', contract, extrasProp),
    write = prepare(itterable, 'write', contract, extrasProp)

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
