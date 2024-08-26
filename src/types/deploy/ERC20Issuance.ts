import type { PopPublicClient, PopWalletClient } from '@/types'

export type DeployERC20IssuanceParams = {
  /**
   * The name of the token
   * @example 'My Token'
   */
  name: string
  /**
   * The symbol of the token
   * @example 'MT'
   */
  symbol: string
  /**
   * The number of decimals the token uses
   * @example 18
   */
  decimals: number
  /**
   * The maximum supply of the token - in human readable format
   * @example '1000'
   */
  maxSupply: string
  /**
   * The address of the initial admin
   */
  initialAdmin: `0x${string}`
  walletClient: PopWalletClient
  publicClient: PopPublicClient
}
