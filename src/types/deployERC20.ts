import type { PopPublicClient, PopWalletClient } from '../types'

export type DeployERC20Params = {
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
   * The initial supply of the token, in the human-readable format
   * @example '1000'
   */
  initialSupply: string
  walletClient: PopWalletClient
  publicClient: PopPublicClient
}
