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
 * @template TModuleType - The module type
 * @template TWalletClient - The wallet client
 */
export type TokenModuleData<
  TModuleName extends WorkflowToken,
  TWalletClient extends PopWalletClient | undefined,
> = {
  address: Hex
  module: GetModuleReturnType<TModuleName, TWalletClient>
  decimals: number
  symbol: string
}

/**
 * @description The conditional issuance token type
 * @template TRequestedModules - The requested modules
 * @template TIssuanceToken - The issuance token type
 * @template TWalletClient - The wallet client
 */
export type ConditionalIssuanceToken<
  T extends MixedRequestedModules | undefined,
  TIssuanceToken extends WorkflowIssuanceToken,
  TWalletClient extends PopWalletClient | undefined,
> =
  T extends NonNullable<T>
    ? (
        T['fundingManager'] extends ModuleData
          ? FilterByPrefix<T['fundingManager']['name'], 'FM_BC'>
          : FilterByPrefix<T['fundingManager'], 'FM_BC'>
      ) extends never
      ? TokenModuleData<TIssuanceToken, TWalletClient> | undefined
      : TokenModuleData<TIssuanceToken, TWalletClient>
    : TokenModuleData<TIssuanceToken, TWalletClient> | undefined

/**
 * @description The get workflow token params type
 * @template T - The workflow token type
 * @template TWalletClient - The wallet client
 */
export type GetWorkflowTokenParams<
  TModuleName extends WorkflowToken,
  TWalletClient extends PopWalletClient | undefined,
> = {
  tokenType: TModuleName
  fundingManagerAddress: Hex
  publicClient: PopPublicClient
  walletClient?: TWalletClient
  self?: Inverter<TWalletClient>
}

/**
 * @description The get workflow token return type
 * @template TModuleName - The module name
 * @template TWalletClient - The wallet client
 */
export type GetWorkflowTokenReturnType<
  TModuleName extends WorkflowToken,
  TWalletClient extends PopWalletClient | undefined,
> = {
  address: Hex
  module: GetModuleReturnType<TModuleName, TWalletClient>
  decimals: number
  symbol: string
}
