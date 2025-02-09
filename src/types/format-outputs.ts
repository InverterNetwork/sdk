import type { PublicClient } from 'viem'
import type {
  TupleExtendedAbiParameter,
  Extras,
  TagCallback,
  ExtendedAbiParameter,
} from '.'
import type { Inverter } from '@'

export type FormatOutputsParams = {
  output: ExtendedAbiParameter
  res: any
  extras?: Extras
  tagCallback: TagCallback
}

export type FormatOutputTupleCaseParams = {
  output: TupleExtendedAbiParameter
  res: any
  extras?: Extras
  tagCallback: TagCallback
}

export type FormatGetTagCallbackParams = {
  extendedOutputs: readonly ExtendedAbiParameter[]
  res: any
  extras?: Extras
  publicClient: PublicClient
  contract?: any
  self?: Inverter
}
