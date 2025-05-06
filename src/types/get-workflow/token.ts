// external dependencies
import type { Hex } from 'viem'

// sdk types
import type {
  GetModuleReturnType,
  PopWalletClient,
  FilterByPrefix,
  PopPublicClient,
  WorkflowToken,
  WorkflowIssuanceToken,
  MixedRequestedModules,
  ModuleData,
} from '@/types'
import type { Inverter } from '@/inverter'

/**
 * @description The token module data type
 * @template W - The wallet client
 * @template A - The module type
 */
export type TokenModuleData<
  W extends PopWalletClient | undefined,
  A extends WorkflowToken,
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
  O extends MixedRequestedModules | undefined,
  IT extends WorkflowIssuanceToken,
> =
  O extends NonNullable<O>
    ? (
        O['fundingManager'] extends ModuleData
          ? FilterByPrefix<O['fundingManager']['name'], 'FM_BC'>
          : FilterByPrefix<O['fundingManager'], 'FM_BC'>
      ) extends never
      ? TokenModuleData<W, IT> | undefined
      : TokenModuleData<W, IT>
    : TokenModuleData<W, IT> | undefined

export type GetWorkflowTokenParams<
  T extends WorkflowToken,
  W extends PopWalletClient | undefined = undefined,
> = {
  tokenType: T
  fundingManagerAddress: Hex
  publicClient: PopPublicClient
  walletClient?: W
  self?: Inverter<W>
}

export type GetWorkflowTokenReturnType<
  T extends WorkflowToken,
  W extends PopWalletClient | undefined = undefined,
> = {
  address: Hex
  module: GetModuleReturnType<T, W>
  decimals: number
  symbol: string
}
