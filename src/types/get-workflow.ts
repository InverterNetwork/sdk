// external dependencies
import type { UserFacingModuleType } from '@inverter-network/abis'
import type { Merge } from 'type-fest-4'
import type { Hex } from 'viem'

// sdk types
import { Inverter } from '@/inverter'
import type {
  FilterByPrefix,
  GetModuleReturnType,
  OmitNever,
  PopPublicClient,
  PopWalletClient,
  RequestedModules,
} from '@/types'

/**
 * @description The parameters for the getWorkflow function
 * @template O - The requested modules
 * @template W - The wallet client
 */
export type GetWorkflowParams<
  O extends RequestedModules | undefined = undefined,
  W extends PopWalletClient | undefined = undefined,
> = {
  publicClient: PopPublicClient
  walletClient?: W
  orchestratorAddress: Hex
  requestedModules?: O
  self?: Inverter<W>
}

/**
 * @description The workflow type
 * @template W - The wallet client
 * @template O - The requested modules
 */
export type Workflow<
  W extends PopWalletClient | undefined,
  O extends RequestedModules | undefined,
> = Merge<
  MendatoryAndOptionalWorkflow<W, O>,
  {
    orchestrator: GetModuleReturnType<'Orchestrator_v1', W>
    fundingToken: TokenModuleData<W, 'ERC20'>
    issuanceToken: ConditionalIssuanceToken<W, O, 'ERC20Issuance_v1'>
  }
>

/**
 * @description The workflow module type
 */
export type WorkflowModuleType = Exclude<UserFacingModuleType, 'orchestrator'>

/**
 * @description The mandatory result type
 * @template W - The wallet client
 * @template O - The requested modules
 */
type MandatoryResult<
  W extends PopWalletClient | undefined,
  O extends RequestedModules | undefined,
> = {
  [K in Exclude<WorkflowModuleType, 'optionalModule'>]: O extends NonNullable<O>
    ? GetModuleReturnType<O[K], W>
    : GetModuleReturnType<RequestedModules[K], W>
}

/**
 * @description The optional result type
 * @template W - The wallet client
 * @template O - The requested modules
 */
type OptionalResult<
  W extends PopWalletClient | undefined,
  O extends RequestedModules | undefined,
> = OmitNever<{
  optionalModule: O extends NonNullable<O>
    ? O['optionalModules'] extends NonNullable<O['optionalModules']>
      ? {
          [K in O['optionalModules'][number]]: GetModuleReturnType<K, W>
        }
      : never
    : {
        [K in NonNullable<
          RequestedModules['optionalModules']
        >[number]]: GetModuleReturnType<K, W>
      }
}>

/**
 * @description The mendatory and optional workflow type
 * @template W - The wallet client
 * @template O - The requested modules
 */
export type MendatoryAndOptionalWorkflow<
  W extends PopWalletClient | undefined,
  O extends RequestedModules | undefined,
> = MandatoryResult<W, O> & OptionalResult<W, O>

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
