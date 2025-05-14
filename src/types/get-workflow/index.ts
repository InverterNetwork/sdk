// external dependencies
import type { ModuleName, UserFacingModuleType } from '@inverter-network/abis'
import type { Merge } from 'type-fest-4'
import type { Hex } from 'viem'

// sdk types
import { Inverter } from '@/inverter'
import type {
  GetModuleReturnType,
  WorkflowIssuanceToken,
  OmitNever,
  PopPublicClient,
  PopWalletClient,
  RequestedModules,
  WorkflowToken,
  MixedRequestedModules,
  ModuleData,
} from '@/types'

// get-workflow types
import type { TokenModuleData, ConditionalIssuanceToken } from './token'

// exports
export * from './token'

/**
 * @description The parameters for the getWorkflow function
 * @template O - The requested modules
 * @template W - The wallet client
 */
export type GetWorkflowParams<
  O extends MixedRequestedModules | undefined = undefined,
  W extends PopWalletClient | undefined = undefined,
  FT extends WorkflowToken | undefined = undefined,
  IT extends WorkflowIssuanceToken | undefined = undefined,
> = {
  publicClient: PopPublicClient
  walletClient?: W
  orchestratorAddress: Hex
  requestedModules?: O
  fundingTokenType?: FT
  issuanceTokenType?: IT
  self?: Inverter<W>
}

/**
 * @description The workflow type
 * @template W - The wallet client
 * @template T - The requested modules
 * @template FT - The funding token type
 * @template IT - The issuance token type
 */
export type Workflow<
  W extends PopWalletClient | undefined,
  T extends MixedRequestedModules | undefined,
  FT extends WorkflowToken | undefined = undefined,
  IT extends WorkflowIssuanceToken | undefined = undefined,
> = Merge<
  MendatoryAndOptionalWorkflow<W, T>,
  {
    orchestrator: GetModuleReturnType<'Orchestrator_v1', W>
    fundingToken: TokenModuleData<W, FT extends undefined ? 'ERC20' : FT>
    issuanceToken: ConditionalIssuanceToken<
      W,
      T,
      IT extends undefined ? 'ERC20Issuance_v1' : IT
    >
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
  O extends MixedRequestedModules | undefined,
> = {
  [K in Exclude<WorkflowModuleType, 'optionalModule'>]: O extends NonNullable<O>
    ? O[K] extends ModuleData
      ? GetModuleReturnType<O[K], W>
      : O[K] extends ModuleName
        ? GetModuleReturnType<O[K], W>
        : never
    : GetModuleReturnType<RequestedModules[K], W>
}

/**
 * @description The optional result type
 * @template W - The wallet client
 * @template O - The requested modules
 */
type OptionalResult<
  W extends PopWalletClient | undefined,
  O extends MixedRequestedModules | undefined,
> = OmitNever<{
  optionalModule: O extends NonNullable<O>
    ? O['optionalModules'] extends NonNullable<O['optionalModules']>
      ? // First, we handle the case where the module is a ModuleName
        {
          [K in O['optionalModules'][number] extends ModuleName
            ? O['optionalModules'][number]
            : never]: GetModuleReturnType<K, W>
        } & {
          // Then, we handle the case where the module is a ModuleData
          [K in O['optionalModules'][number] extends ModuleData
            ? O['optionalModules'][number]['name']
            : never]: GetModuleReturnType<
            Extract<O['optionalModules'][number], { name: K }>,
            W
          >
        }
      : never
    : never
}>

/**
 * @description The mendatory and optional workflow type
 * @template W - The wallet client
 * @template O - The requested modules
 */
export type MendatoryAndOptionalWorkflow<
  W extends PopWalletClient | undefined,
  O extends MixedRequestedModules | undefined,
> = MandatoryResult<W, O> & OptionalResult<W, O>
