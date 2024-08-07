import getModule from '../getModule'
import { Inverter } from '../Inverter'

import type {
  UserFacingModuleType,
  GetModuleNameByType,
} from '@inverter-network/abis'
import type { Merge } from 'type-fest-4'
import type { OmitNever, PopPublicClient, PopWalletClient } from '../types'
import type { Hex } from 'viem'

export type GetWorkflowParams<
  O extends WorkflowOrientation | undefined = undefined,
  W extends PopWalletClient | undefined = undefined,
> = {
  publicClient: PopPublicClient
  walletClient?: W
  orchestratorAddress: Hex
  workflowOrientation?: O
  self?: Inverter<W>
}

export type WorkflowModuleType = Exclude<UserFacingModuleType, 'orchestrator'>

type OrientationPart<
  MT extends WorkflowModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = N

export type WorkflowOrientation = Merge<
  {
    [T in Exclude<WorkflowModuleType, 'optionalModule'>]: OrientationPart<T>
  },
  {
    optionalModules?: OrientationPart<'optionalModule'>[]
  }
>

type MandatoryResult<
  W extends PopWalletClient | undefined,
  O extends WorkflowOrientation | undefined,
> = {
  [K in Exclude<WorkflowModuleType, 'optionalModule'>]: O extends NonNullable<O>
    ? ReturnType<typeof getModule<O[K], W>>
    : ReturnType<typeof getModule<WorkflowOrientation[K], W>>
}

type OptionalResult<
  W extends PopWalletClient | undefined,
  O extends WorkflowOrientation | undefined,
> = OmitNever<{
  optionalModule: O extends NonNullable<O>
    ? O['optionalModules'] extends NonNullable<O['optionalModules']>
      ? {
          [K in O['optionalModules'][number]]: ReturnType<
            typeof getModule<K, W>
          >
        }
      : never
    : {
        [K in NonNullable<
          WorkflowOrientation['optionalModules']
        >[number]]: ReturnType<typeof getModule<K, W>>
      }
}>

export type MendatoryAndOptionalWorkflow<
  W extends PopWalletClient | undefined,
  O extends WorkflowOrientation | undefined,
> = MandatoryResult<W, O> & OptionalResult<W, O>

export type Workflow<
  W extends PopWalletClient | undefined,
  O extends WorkflowOrientation | undefined,
> = Merge<
  MendatoryAndOptionalWorkflow<W, O>,
  {
    orchestrator: ReturnType<typeof getModule<'Orchestrator_v1', W>>
    erc20Module: ReturnType<typeof getModule<'ERC20', W>>
    erc20Decimals: number
    erc20Symbol: string
  }
>
