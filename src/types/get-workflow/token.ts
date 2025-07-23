// external dependencies
import type { Inverter } from '@/inverter'
// sdk types
import type {
  FilterByPrefix,
  GetModuleReturnType,
  MixedRequestedModules,
  ModuleData,
  PopPublicClient,
  PopWalletClient,
  WorkflowIssuanceToken,
  WorkflowToken,
} from '@/types'
import type { Hex } from 'viem'

/**
 * @description The token module data type
 * @template TModuleType - The module type
 * @template TWalletClient - The wallet client
 * @template TUseTags - Whether auto parse inputs, outputs and approve allowances using tag configs
 */
export type TokenModuleData<
  TModuleName extends WorkflowToken,
  TWalletClient extends PopWalletClient | undefined,
  TUseTags extends boolean = true,
> = {
  address: Hex
  module: GetModuleReturnType<TModuleName, TWalletClient, undefined, TUseTags>
  decimals: number
  symbol: string
}

/**
 * @description The conditional issuance token type
 * @template TRequestedModules - The requested modules
 * @template TIssuanceToken - The issuance token type
 * @template TWalletClient - The wallet client
 * @template TUseTags - Whether auto parse inputs, outputs and approve allowances using tag configs
 */
export type ConditionalIssuanceToken<
  TRequestedModules extends MixedRequestedModules | undefined,
  TIssuanceToken extends WorkflowIssuanceToken,
  TWalletClient extends PopWalletClient | undefined,
  TUseTags extends boolean = true,
> =
  TRequestedModules extends NonNullable<TRequestedModules>
    ? (
        TRequestedModules['fundingManager'] extends ModuleData
          ? FilterByPrefix<TRequestedModules['fundingManager']['name'], 'FM_BC'>
          : FilterByPrefix<TRequestedModules['fundingManager'], 'FM_BC'>
      ) extends never
      ? TokenModuleData<TIssuanceToken, TWalletClient, TUseTags> | undefined
      : TokenModuleData<TIssuanceToken, TWalletClient, TUseTags>
    : TokenModuleData<TIssuanceToken, TWalletClient, TUseTags> | undefined

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
  useTags?: boolean
}

/**
 * @description The get workflow token return type
 * @template TModuleName - The module name
 * @template TWalletClient - The wallet client
 */
export type GetWorkflowTokenReturnType<
  TModuleName extends WorkflowToken,
  TWalletClient extends PopWalletClient | undefined,
  TUseTags extends boolean = true,
> = {
  address: Hex
  module: GetModuleReturnType<TModuleName, TWalletClient, undefined, TUseTags>
  decimals: number
  symbol: string
}
