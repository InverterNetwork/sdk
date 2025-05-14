import type { Chain, HttpTransport } from 'viem'
import { http } from 'viem'
import * as chains from 'viem/chains'

/**
 * Get a chain by its id
 */
export const getChainById = (chainId: number): Chain => {
  const chain = Object.values(chains).find((chain) => chain.id === chainId)
  if (!chain) throw new Error('Chain not found')
  return chain
}

/**
 * Get all chain names
 */
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

/**
 * Get the name of a chain by its id
 */
export const getChainName = (chainId: number) => {
  return chainNames.find((chain) => chain.id === chainId)?.name
}

/**
 * Creates an HTTP transport for a specific chain
 */
export const getERPCTransport = (chainId: number): HttpTransport => {
  return http(`https://rpc.inverter.network/main/evm/${chainId}`, {
    timeout: 10000,
  })
}
