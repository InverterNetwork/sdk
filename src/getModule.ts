import type { ModuleKeys, ModuleVersionKeys } from '@inverter-network/abis'
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
import getAbiMethodMetas from './utlis/getAbiMethodMetas'
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
  const { moduletype, abi, description } = moduleData

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
  const abiMethodMetas = getAbiMethodMetas(abi),
    methodMetas = moduleData.methodMetas

  const structMap = abiMethodMetas.map((meta) => {
    return formatMethodStruct({
      abiMethodMeta: meta,
      methodMeta: methodMetas[meta.name],
      contract,
    })
  })

  const methods: {
    [MK in (typeof structMap)[number]['name']]: MethodStruct<K, V, MK>
  } = structMap.reduce((acc, item) => {
    acc[item.name] = item
    return acc
  }, {} as any)

  return {
    name,
    version,
    address,
    moduletype,
    description,
    methods,
  }
}
