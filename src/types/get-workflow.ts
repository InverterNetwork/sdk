import { Inverter } from '@/inverter'

import type {
  UserFacingModuleType,
  GetModuleNameByType,
} from '@inverter-network/abis'
import type { Merge } from 'type-fest-4'
import type {
  FilterByPrefix,
  GetModuleReturn,
  OmitNever,
  PopPublicClient,
  PopWalletClient,
} from '@/types'
import type { Hex } from 'viem'

export type GetWorkflowParams<
  O extends WorkflowRequestedModules | undefined = undefined,
  W extends PopWalletClient | undefined = undefined,
> = {
  publicClient: PopPublicClient
  walletClient?: W
  orchestratorAddress: Hex
  requestedModules?: O
  self?: Inverter<W>
}

export type WorkflowModuleType = Exclude<UserFacingModuleType, 'orchestrator'>

type OrientationPart<
  MT extends WorkflowModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = N

export type WorkflowRequestedModules = Merge<
  {
    [T in Exclude<WorkflowModuleType, 'optionalModule'>]: OrientationPart<T>
  },
  {
    optionalModules?: OrientationPart<'optionalModule'>[]
  }
>

type MandatoryResult<
  W extends PopWalletClient | undefined,
  O extends WorkflowRequestedModules | undefined,
> = {
  [K in Exclude<WorkflowModuleType, 'optionalModule'>]: O extends NonNullable<O>
    ? GetModuleReturn<O[K], W>
    : GetModuleReturn<WorkflowRequestedModules[K], W>
}

type OptionalResult<
  W extends PopWalletClient | undefined,
  O extends WorkflowRequestedModules | undefined,
> = OmitNever<{
  optionalModule: O extends NonNullable<O>
    ? O['optionalModules'] extends NonNullable<O['optionalModules']>
      ? {
          [K in O['optionalModules'][number]]: GetModuleReturn<K, W>
        }
      : never
    : {
        [K in NonNullable<
          WorkflowRequestedModules['optionalModules']
        >[number]]: GetModuleReturn<K, W>
      }
}>

export type MendatoryAndOptionalWorkflow<
  W extends PopWalletClient | undefined,
  O extends WorkflowRequestedModules | undefined,
> = MandatoryResult<W, O> & OptionalResult<W, O>

export type TokenModuleData<
  W extends PopWalletClient | undefined,
  A extends 'ERC20' | 'ERC20Issuance_v1',
> = {
  address: Hex
  module: GetModuleReturn<A, W>
  decimals: number
  symbol: string
}

export type ConditionalIssuanceToken<
  W extends PopWalletClient | undefined,
  O extends WorkflowRequestedModules | undefined,
  A extends 'ERC20' | 'ERC20Issuance_v1',
> =
  O extends NonNullable<O>
    ? FilterByPrefix<O['fundingManager'], 'FM_BC'> extends never
      ? TokenModuleData<W, A> | undefined
      : TokenModuleData<W, A>
    : TokenModuleData<W, A> | undefined

export type Workflow<
  W extends PopWalletClient | undefined,
  O extends WorkflowRequestedModules | undefined,
> = Merge<
  MendatoryAndOptionalWorkflow<W, O>,
  {
    orchestrator: GetModuleReturn<'Orchestrator_v1', W>
    fundingToken: TokenModuleData<W, 'ERC20'>
    issuanceToken: ConditionalIssuanceToken<W, O, 'ERC20Issuance_v1'>
  }
>
