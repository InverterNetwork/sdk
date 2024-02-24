import type {
  AbiReadFunction,
  AbiWriteFunction,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'
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
import { getAbiReadMethods, getAbiWriteMethods } from './utlis/getAbiMethods'
import formatMethodStruct, { MethodStruct } from './utlis/formatMethodStruct'

export default function getModule<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
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
  const { moduletype, abi, description, methodMetas } = moduleData

  // Construct a contract object using the address and clients
  const contract = getContract({
    abi,
    address,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  })

  const read: {
    [MK in AbiReadFunction<K, V>['name']]: MethodStruct<K, V, MK>
  } = getAbiReadMethods(abi)
    .map((meta) => {
      return formatMethodStruct({
        abiMethod: meta,
        methodMeta: methodMetas.find((i) => i.name === meta.name)!,
        contract,
        type: 'read',
      })
    })
    .reduce((acc, item) => {
      acc[item.name] = item
      return acc
    }, {} as any)

  const write: {
    [MK in AbiWriteFunction<K, V>['name']]: MethodStruct<K, V, MK>
  } = getAbiWriteMethods(abi)
    .map((meta) => {
      return formatMethodStruct({
        abiMethod: meta,
        methodMeta: methodMetas.find((i) => i.name === meta.name)!,
        contract,
        type: 'write',
      })
    })
    .reduce((acc, item) => {
      acc[item.name] = item
      return acc
    }, {} as any)

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
