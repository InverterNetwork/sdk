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
import prepareFunction from './prepareFunction'
import { Extras } from '../types/base'
import { isValidModule } from '../types/guards'

// TODO make wallet client optional ( addopt the new client prop logic )
export default function getModule<
  K extends ModuleKeys,
  V extends ModuleVersionKey<K>,
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
  walletClient?: WalletClient<Transport, Chain, Account>
  extras?: Extras
}) {
  const mv = data[name][version]
  if (!isValidModule(mv)) throw new Error('Invalid module')
  type T = typeof mv

  // If the walletClient is valid add walletAddress to the extras
  if (!!walletClient)
    extras = { ...extras, walletAddress: walletClient.account.address }

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
    write = prepareFunction(
      abi,
      ['nonpayable', 'payable'],
      contract,
      extras,
      false
    )

  const result = {
    name,
    version,
    address,
    moduleType,
    description,
    read,
    simulate,
    write,
  }

  return result
}
