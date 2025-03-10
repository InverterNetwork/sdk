// external dependencies
import type { PublicClient, WalletClient } from 'viem'

// sdk types
import type {
  MethodKind,
  RequiredAllowances,
  TagConfig,
  ExtendedAbiParameter,
  TagCallback,
  TagOverwrites,
  TupleExtendedAbiParameter,
} from '@/types'
import type { Inverter } from '@/index'

/**
 * @description The base parameters for the processInputs function
 */
export type ProcessInputsBaseParams = {
  tagConfig?: TagConfig
  extendedInputs: readonly ExtendedAbiParameter[]
  args: any
  kind: MethodKind
  tagOverwrites?: TagOverwrites
}

/**
 * @description The parameters for the processInputs function
 */
export type ProcessInputsParams = Omit<
  ParseGetTagCallbackParams,
  'requiredAllowances'
>

/**
 * @description The parameters for the parseGetTagCallback function
 */
export type ParseGetTagCallbackParams = {
  requiredAllowances: RequiredAllowances[]
  publicClient: PublicClient
  walletClient?: WalletClient
  contract?: any
  self?: Inverter<any>
} & ProcessInputsBaseParams

/**
 * @description The parameters for the parseInputs function
 */
export type ParseInputsParams = {
  input: ExtendedAbiParameter
  arg: any
  tagConfig?: TagConfig
  tagCallback: TagCallback
}

/**
 * @description The parameters for the parseInputTupleCase function
 */
export type ParseInputTupleCaseParams = ParseInputsParams & {
  input: TupleExtendedAbiParameter
}
