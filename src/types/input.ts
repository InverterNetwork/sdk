import { FunctionInputs } from '@inverter-network/abis'
import { Prepare } from '../utlis/prepare'
import { Tuple } from './base'

export type FunctionInput = FunctionInputs[number]

export type InputWithComponents<I extends FunctionInput = FunctionInput> =
  Extract<I, Tuple>

export type NonComponentInput = Exclude<FunctionInput, Tuple>
export type InputOmittedComponents = Omit<InputWithComponents, 'components'>
export type ComponentInput = InputWithComponents['components'][number]

export type DecipherableInput =
  | NonComponentInput
  | ComponentInput
  | InputOmittedComponents

export type PreparedInput = Exclude<ReturnType<Prepare['input']>, Tuple>

export type PreparedComponentInput = Extract<
  ReturnType<Prepare['input']>,
  Tuple
>['components'][number]
