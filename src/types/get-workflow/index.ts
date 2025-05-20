// external dependencies
import type { ModuleName, UserFacingModuleType } from '@inverter-network/abis'
// sdk types
import { Inverter } from '@/inverter'
import type {
  GetModuleReturnType,
  MixedRequestedModules,
  ModuleData,
  OmitNever,
  PopPublicClient,
  PopWalletClient,
  RequestedModules,
  WorkflowIssuanceToken,
  WorkflowToken,
} from '@/types'
import type { Merge } from 'type-fest-4'
import type { Hex } from 'viem'

// get-workflow types
import type { ConditionalIssuanceToken, TokenModuleData } from './token'

// exports
export * from './token'

/**
 * @description The parameters for the getWorkflow function
 * @template TRequestedModules - The requested modules
 * @template TWalletClient - The wallet client
 * @template TFundingToken - The funding token type
 * @template TIssuanceToken - The issuance token type
 */
export type GetWorkflowParams<
  TRequestedModules extends MixedRequestedModules | undefined = undefined,
  TWalletClient extends PopWalletClient | undefined = undefined,
  TFundingToken extends WorkflowToken | undefined = undefined,
  TIssuanceToken extends WorkflowIssuanceToken | undefined = undefined,
> = {
  publicClient: PopPublicClient
  walletClient?: TWalletClient
  orchestratorAddress: Hex
  requestedModules?: TRequestedModules
  fundingTokenType?: TFundingToken
  issuanceTokenType?: TIssuanceToken
  self?: Inverter<TWalletClient>
}

/**
 * @description The workflow type
 * @template TRequestedModules - The requested modules
 * @template TWalletClient - The wallet client
 * @template TFundingToken - The funding token type
 * @template TIssuanceToken - The issuance token type
 */
export type Workflow<
  TRequestedModules extends MixedRequestedModules | undefined,
  TWalletClient extends PopWalletClient | undefined,
  TFundingToken extends WorkflowToken | undefined = undefined,
  TIssuanceToken extends WorkflowIssuanceToken | undefined = undefined,
> = Merge<
  MendatoryAndOptionalWorkflow<TRequestedModules, TWalletClient>,
  {
    orchestrator: GetModuleReturnType<'Orchestrator_v1', TWalletClient>
    fundingToken: TokenModuleData<
      TFundingToken extends undefined ? 'ERC20' : TFundingToken,
      TWalletClient
    >
    issuanceToken: ConditionalIssuanceToken<
      TRequestedModules,
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
 * @template TRequestedModules - The requested modules
 * @template TWalletClient - The wallet client
 */
type MandatoryResult<
  TRequestedModules extends MixedRequestedModules | undefined,
  TWalletClient extends PopWalletClient | undefined,
> = {
  [K in Exclude<
    WorkflowModuleType,
    'optionalModule'
  >]: TRequestedModules extends NonNullable<TRequestedModules>
    ? TRequestedModules[K] extends ModuleData
      ? GetModuleReturnType<never, TWalletClient, TRequestedModules[K]>
      : TRequestedModules[K] extends ModuleName
        ? GetModuleReturnType<TRequestedModules[K], TWalletClient>
        : never
    : GetModuleReturnType<RequestedModules[K], TWalletClient>
}

/**
 * @description The optional result type
 * @template TRequestedModules - The requested modules
 * @template TWalletClient - The wallet client
 */
type OptionalResult<
  TRequestedModules extends MixedRequestedModules | undefined,
  TWalletClient extends PopWalletClient | undefined,
> = OmitNever<{
  // 1. Check if the requested modules are non-nullable
  optionalModule: TRequestedModules extends NonNullable<TRequestedModules>
    ? // 2. Check if the optional modules are non-nullable
      TRequestedModules['optionalModules'] extends NonNullable<
        TRequestedModules['optionalModules']
      >
      ? // 3. First part is the module with registered name
        {
          [K in TRequestedModules['optionalModules'][number] extends ModuleName
            ? TRequestedModules['optionalModules'][number]
            : never]: GetModuleReturnType<K, TWalletClient>
        } & {
          // 4. Second part is the module with passed data
          [K in TRequestedModules['optionalModules'][number] extends ModuleData
            ? TRequestedModules['optionalModules'][number]['name']
            : never]: GetModuleReturnType<
            never,
            TWalletClient,
            K extends ModuleName
              ? undefined
              : Extract<
                  TRequestedModules['optionalModules'][number],
                  { name: K }
                >
          >
        }
      : never
    : {
        [K in NonNullable<
          RequestedModules['optionalModules']
        >[number]]: GetModuleReturnType<K, TWalletClient>
      }
}>

/**
 * @description The mendatory and optional workflow type
 * @template TRequestedModules - The requested modules
 * @template TWalletClient - The wallet client
 */
export type MendatoryAndOptionalWorkflow<
  TRequestedModules extends MixedRequestedModules | undefined,
  TWalletClient extends PopWalletClient | undefined,
> = MandatoryResult<TRequestedModules, TWalletClient> &
  OptionalResult<TRequestedModules, TWalletClient>
