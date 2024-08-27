import type { PublicClient, WalletClient } from 'viem'
import type { Extras, ExtendedAbiParameter } from '.'
import type { MethodKind, RequiredAllowances } from '@/types'
import type { Inverter, TagCallback, TupleExtendedAbiParameter } from '@'

export type ProcessInputsBaseParams = {
  extras?: Extras
  extendedInputs: readonly ExtendedAbiParameter[]
  args: any
  kind: MethodKind
}

export type ProcessInputsParams = Omit<
  ParseGetTagCallbackParams,
  'requiredAllowances'
>

export type ParseGetTagCallbackParams = {
  requiredAllowances: RequiredAllowances[]
  publicClient: PublicClient
  walletClient?: WalletClient
  contract?: any
  self?: Inverter<any>
} & ProcessInputsBaseParams

export type ParseInputsParams = {
  input: ExtendedAbiParameter
  arg: any
  extras?: Extras
  tagCallback: TagCallback
}

export type ParseInputTupleCaseParams = {
  input: TupleExtendedAbiParameter
  arg: any
  extras?: Extras
  tagCallback: TagCallback
}
