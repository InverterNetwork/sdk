import {
  UserFacingModuleType,
  GetModuleNameByType,
} from '@inverter-network/abis'
import { Merge } from 'type-fest-4'

import { OmitNever, PopWalletClient } from '../types'
import getModule from '../getModule'

type ModuleType = Exclude<UserFacingModuleType, 'orchestrator'>

type OrientationPart<
  MT extends ModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = N

export type WorkflowOrientation = Merge<
  {
    [T in Exclude<ModuleType, 'optionalModule'>]: OrientationPart<T>
  },
  {
    optionalModules?: OrientationPart<'optionalModule'>[]
  }
>

type MandatoryResult<
  W extends PopWalletClient | undefined,
  O extends WorkflowOrientation | undefined,
> = {
  [K in Exclude<ModuleType, 'optionalModule'>]: O extends NonNullable<O>
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

export type Workflow<
  W extends PopWalletClient | undefined,
  O extends WorkflowOrientation | undefined,
> = MandatoryResult<W, O> & OptionalResult<W, O>
