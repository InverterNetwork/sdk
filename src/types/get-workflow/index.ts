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
 * @template T - The requested modules
 * @template TWalletClient - The wallet client
 * @template TFundingToken - The funding token type
 * @template TIssuanceToken - The issuance token type
 */
export type GetWorkflowParams<
  T extends MixedRequestedModules | undefined = undefined,
  TWalletClient extends PopWalletClient | undefined = undefined,
  TFundingToken extends WorkflowToken | undefined = undefined,
  TIssuanceToken extends WorkflowIssuanceToken | undefined = undefined,
> = {
  publicClient: PopPublicClient
  walletClient?: TWalletClient
  orchestratorAddress: Hex
  requestedModules?: T
  fundingTokenType?: TFundingToken
  issuanceTokenType?: TIssuanceToken
  self?: Inverter<TWalletClient>
}

/**
 * @description The workflow type
 * @template T - The requested modules
 * @template TWalletClient - The wallet client
 * @template TFundingToken - The funding token type
 * @template TIssuanceToken - The issuance token type
 */
export type Workflow<
  T extends MixedRequestedModules | undefined,
  TWalletClient extends PopWalletClient | undefined,
  TFundingToken extends WorkflowToken | undefined = undefined,
  TIssuanceToken extends WorkflowIssuanceToken | undefined = undefined,
> = Merge<
  MendatoryAndOptionalWorkflow<T, TWalletClient>,
  {
    orchestrator: GetModuleReturnType<'Orchestrator_v1', TWalletClient>
    fundingToken: TokenModuleData<
      TFundingToken extends undefined ? 'ERC20' : TFundingToken,
      TWalletClient
    >
    issuanceToken: ConditionalIssuanceToken<
      T,
      TIssuanceToken extends undefined ? 'ERC20Issuance_v1' : TIssuanceToken,
      TWalletClient
    >
  }
>

/**
 * @description The workflow module type
 */
export type WorkflowModuleType = Exclude<UserFacingModuleType, 'orchestrator'>

/**
 * @description The mandatory result type
 * @template T - The requested modules
 * @template TWalletClient - The wallet client
 */
type MandatoryResult<
  T extends MixedRequestedModules | undefined,
  TWalletClient extends PopWalletClient | undefined,
> = {
  [K in Exclude<WorkflowModuleType, 'optionalModule'>]: T extends NonNullable<T>
    ? T[K] extends ModuleData
      ? GetModuleReturnType<never, TWalletClient, T[K]>
      : T[K] extends ModuleName
        ? GetModuleReturnType<T[K], TWalletClient>
        : never
    : GetModuleReturnType<RequestedModules[K], TWalletClient>
}

/**
 * @description The optional result type
 * @template T - The requested modules
 * @template TWalletClient - The wallet client
 */
type OptionalResult<
  T extends MixedRequestedModules | undefined,
  TWalletClient extends PopWalletClient | undefined,
> = OmitNever<{
  // 1. Check if the requested modules are non-nullable
  optionalModule: T extends NonNullable<T>
    ? // 2. Check if the optional modules are non-nullable
      T['optionalModules'] extends NonNullable<T['optionalModules']>
      ? // 3. First part is the module with registered name
        {
          [K in T['optionalModules'][number] extends ModuleName
            ? T['optionalModules'][number]
            : never]: GetModuleReturnType<K, TWalletClient>
        } & {
          // 4. Second part is the module with passed data
          [K in T['optionalModules'][number] extends ModuleData
            ? T['optionalModules'][number]['name']
            : never]: GetModuleReturnType<
            never,
            TWalletClient,
            K extends ModuleName
              ? undefined
              : Extract<T['optionalModules'][number], { name: K }>
          >
        }
      : never
    : never
}>

/**
 * @description The mendatory and optional workflow type
 * @template T - The requested modules
 * @template TWalletClient - The wallet client
 */
export type MendatoryAndOptionalWorkflow<
  T extends MixedRequestedModules | undefined,
  TWalletClient extends PopWalletClient | undefined,
> = MandatoryResult<T, TWalletClient> & OptionalResult<T, TWalletClient>
