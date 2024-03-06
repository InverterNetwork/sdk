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
import prepareFunction from './utlis/prepareFunction'
import { Extras } from './types/base'
import { isValidModule } from './types/guards'

export default function getModule<
  K extends ModuleKeys,
  V extends ModuleVersionKey<K>,
  W extends WalletClient<Transport, Chain, Account> | undefined = undefined,
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
  walletClient?: W
  extras?: Extras
}) {
  const mv = data[name][version]
  if (!isValidModule(mv)) throw new Error('Invalid module')
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

  const read = prepareFunction(abi, ['pure', 'view'], contract, extras),
    simulate = prepareFunction(
      abi,
      ['nonpayable', 'payable'],
      contract,
      extras,
      true
    ),
    write = !!walletClient
      ? prepareFunction(abi, ['nonpayable', 'payable'], contract, extras)
      : undefined

  const result = {
    name,
    version,
    address,
    moduleType,
    description,
    read,
    simulate,
    write: write as W extends undefined ? undefined : NonNullable<typeof write>,
  }

  return result
}
