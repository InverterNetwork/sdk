import type { AbiVersionKeys, AbiKeys } from '@inverter-network/abis'
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

export default function getModule<K extends AbiKeys>({
  name,
  version,
  address,
  publicClient,
  walletClient,
}: {
  name: K
  version: AbiVersionKeys
  address: Hex
  publicClient: PublicClient<Transport, Chain>
  walletClient: WalletClient<Transport, Chain, Account>
}) {
  const { moduletype, abi, description } = data[name][version]
  const contract = getContract({
    abi,
    address,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  })

  const metas = getAbiMethodMetas(abi)
  type Meta = (typeof metas)[number]

  const formatMethodStruct = ({ name, type, inputs, outputs }: Meta) => {
    return {
      type,
      run: ({ args, simulate }: { args: any[]; simulate?: boolean }) => {
        // @ts-expect-error too much magic
        return contract[simulate ? 'simulate' : type][name](...args)
      },
      inputs,
      outputs,
    }
  }

  const methods = <
    Record<Meta['name'], ReturnType<typeof formatMethodStruct>>
  >{}

  metas.forEach((meta) => {
    methods[meta.name] = formatMethodStruct(meta)
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
