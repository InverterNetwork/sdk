import type { ModuleKeys, ModuleVersionKey } from '@inverter-network/abis'
import { getModuleVersion } from '@inverter-network/abis'
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
// import { isValidModule } from '../types/guards'

// TODO make wallet client optional ( addopt the new client prop logic )
export default function getModule<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
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
  const mv = getModuleVersion(name, version)
  type MV = typeof mv
  // if (!isValidModule(mv)) throw new Error('Invalid module')

  // If the walletClient is valid add walletAddress to the extras
  if (!!walletClient)
    extras = { ...extras, walletAddress: walletClient.account.address }

  // Get the moduletype, abi, description, and methodMetas from the data object
  const moduleType = mv.moduleType as MV['moduleType'],
    description = mv.description as MV['description'],
    abi = mv.abi as MV['abi']

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
      ? prepareFunction(abi, ['nonpayable', 'payable'], contract, extras, false)
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
