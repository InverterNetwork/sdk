import type { Chain, HttpTransport, PublicClientConfig } from 'viem'
import { createPublicClient, http } from 'viem'
import * as chains from 'viem/chains'

const chainsArray = Object.values(chains)

/**
 * Get a chain by its id
 */
export const getChainById = (chainId: number): Chain => {
  const chain = chainsArray.find((chain) => chain.id === chainId)
  if (!chain) throw new Error('Chain not found')
  return chain
}

/**
 * Get all chain names
 */
export const chainNames = chainsArray.reduce(
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

/**
 * Creates a public client for a specific chain
 */
export const getPublicClient = (
  chainId: number,
  params: Omit<PublicClientConfig, 'chain' | 'transport'> = {
    cacheTime: 5000,
  }
) => {
  const chain = getChainById(chainId)
  const transport = getERPCTransport(chainId)

  if (!chain || !transport) throw new Error('Chain or transport not found')

  return createPublicClient({
    chain,
    transport,
    ...params,
  })
}
