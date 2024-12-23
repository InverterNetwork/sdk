import * as chains from 'viem/chains'

export const chainNames = Object.values(chains).reduce(
  (acc, chain) => {
    // Only add if we haven't seen this chainId before
    if (!acc.some((item) => item.id === chain.id)) {
      acc.push({
        id: chain.id,
        name: chain.name,
        testnet: chain.testnet,
      })
    }
    return acc
  },
  [] as { id: number; name: string; testnet?: boolean }[]
)

export const getChainName = (chainId: number) => {
  return chainNames.find((chain) => chain.id === chainId)?.name
}
