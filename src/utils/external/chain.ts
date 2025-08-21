import type { Chain, HttpTransport } from 'viem'
import { http } from 'viem'
import * as chains from 'viem/chains'

/**
 * Mainnet chains with protocol deployments
 * Based on ProtocolConstants_v1.s.sol deployedMainnets
 */
export const mainnetChains = [
  chains.optimism, // Chain ID: 10
  chains.polygon, // Chain ID: 137
  chains.polygonZkEvm, // Chain ID: 1101
  chains.avalanche, // Chain ID: 43114
] as Array<Chain>

/**
 * Testnet chains with protocol deployments
 * Based on ProtocolConstants_v1.s.sol deployedTestnets
 */
export const testnetChains = [
  chains.polygonZkEvmCardona, // Chain ID: 2442
  chains.polygonAmoy, // Chain ID: 80002
  chains.baseSepolia, // Chain ID: 84532
  chains.sepolia, // Chain ID: 11155111
  chains.optimismSepolia, // Chain ID: 11155420
] as Array<Chain>

/**
 * All supported chains (mainnet + testnet)
 */
export const supportedChains = [...mainnetChains, ...testnetChains]

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
