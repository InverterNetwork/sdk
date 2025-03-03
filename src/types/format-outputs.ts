// external dependencies
import type { PublicClient } from 'viem'

// sdk types
import type {
  TupleExtendedAbiParameter,
  Extras,
  TagCallback,
  ExtendedAbiParameter,
} from '@/types'
import type { Inverter } from '@/index'

/**
 * @description The parameters for the formatOutputs function
 */
export type FormatOutputsParams = {
  output: ExtendedAbiParameter
  res: any
  extras?: Extras
  tagCallback: TagCallback
}

/**
 * @description The parameters for the formatOutputTupleCase function
 */
export type FormatOutputTupleCaseParams = {
  output: TupleExtendedAbiParameter
  res: any
  extras?: Extras
  tagCallback: TagCallback
}

/**
 * @description The parameters for the formatGetTagCallback function
 */
export type FormatGetTagCallbackParams = {
  extendedOutputs: readonly ExtendedAbiParameter[]
  res: any
  extras?: Extras
  publicClient: PublicClient
  contract?: any
  self?: Inverter
}
