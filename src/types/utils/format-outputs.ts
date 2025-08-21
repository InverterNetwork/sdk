// external dependencies
import type { Inverter } from '@/index'
// sdk types
import type {
  ExtendedAbiParameter,
  TagCallback,
  TagConfig,
  TupleExtendedAbiParameter,
} from '@/types'
import type { PublicClient } from 'viem'

/**
 * @description The parameters for the formatOutputs function
 */
export type FormatOutputsParams = {
  output: ExtendedAbiParameter
  res: any
  tagConfig?: TagConfig
  tagCallback: TagCallback
}

/**
 * @description The parameters for the formatOutputTupleCase function
 */
export type FormatOutputTupleCaseParams = {
  output: TupleExtendedAbiParameter
  res: any
  tagConfig?: TagConfig
  tagCallback: TagCallback
}

/**
 * @description The parameters for the formatGetTagCallback function
 */
export type FormatGetTagCallbackParams = {
  extendedOutputs: readonly ExtendedAbiParameter[]
  res: any
  tagConfig?: TagConfig
  publicClient: PublicClient
  contract?: any
  self?: Inverter
  useTags?: boolean
}
