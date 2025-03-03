// external dependencies
import type { Hex } from 'viem'

// sdk types
import type {
  GetModuleReturnType,
  PopWalletClient,
  RequestedModules,
  FilterByPrefix,
  PopPublicClient,
} from '@/types'
import type { Inverter } from '@/inverter'

/**
 * @description The token module data type
 * @template W - The wallet client
 * @template A - The module type
 */
export type TokenModuleData<
  W extends PopWalletClient | undefined,
  A extends 'ERC20' | 'ERC20Issuance_v1',
> = {
  address: Hex
  module: GetModuleReturnType<A, W>
  decimals: number
  symbol: string
}

/**
 * @description The conditional issuance token type
 * @template W - The wallet client
 * @template O - The requested modules
 * @template A - The module type
 */
export type ConditionalIssuanceToken<
  W extends PopWalletClient | undefined,
  O extends RequestedModules | undefined,
  A extends 'ERC20' | 'ERC20Issuance_v1',
> =
  O extends NonNullable<O>
    ? FilterByPrefix<O['fundingManager'], 'FM_BC'> extends never
      ? TokenModuleData<W, A> | undefined
      : TokenModuleData<W, A>
    : TokenModuleData<W, A> | undefined

export type GetWorkflowTokenResultParams<
  W extends PopWalletClient | undefined = undefined,
> = {
  fundingManagerAddress: Hex
  publicClient: PopPublicClient
  walletClient?: W
  self?: Inverter<W>
}

export type GetWorkflowTokenResultReturnType<
  T extends 'ERC20' | 'ERC20Issuance_v1',
  W extends PopWalletClient | undefined = undefined,
> = {
  address: Hex
  module: GetModuleReturnType<T, W>
  decimals: number
  symbol: string
}
