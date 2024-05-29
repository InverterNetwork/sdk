import {
  UserFacingModuleType,
  GetModuleNameByType,
} from '@inverter-network/abis'
import { Merge } from 'type-fest-4'

import { OmitNever, PopWalletClient } from '../types'
import getModule from '../getModule'

type OrientationPart<
  MT extends UserFacingModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = N

export type WorkflowOrientation = Merge<
  {
    [T in Exclude<UserFacingModuleType, 'logicModule'>]: OrientationPart<T>
  },
  {
    logicModules?: OrientationPart<'logicModule'>[]
  }
>

type MandatoryResult<
  W extends PopWalletClient | undefined,
  O extends WorkflowOrientation | undefined,
> = {
  [K in Exclude<UserFacingModuleType, 'logicModule'>]: O extends NonNullable<O>
    ? ReturnType<typeof getModule<O[K], W>>
    : ReturnType<typeof getModule<WorkflowOrientation[K], W>>
}

type OptionalResult<
  W extends PopWalletClient | undefined,
  O extends WorkflowOrientation | undefined,
> = OmitNever<{
  logicModule: O extends NonNullable<O>
    ? O['logicModules'] extends NonNullable<O['logicModules']>
      ? {
          [K in O['logicModules'][number]]: ReturnType<typeof getModule<K, W>>
        }
      : never
    : {
        [K in NonNullable<
          WorkflowOrientation['logicModules']
        >[number]]: ReturnType<typeof getModule<K, W>>
      }
}>

export type Workflow<
  W extends PopWalletClient | undefined,
  O extends WorkflowOrientation | undefined,
> = MandatoryResult<W, O> & OptionalResult<W, O>
