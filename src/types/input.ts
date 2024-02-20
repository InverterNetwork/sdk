import { FunctionInputs } from '@inverter-network/abis'
import { Prepared } from '../utlis/prepare'

export type FunctionInput = FunctionInputs[number]

export type InputWithComponents = Extract<FunctionInput, { type: 'tuple[]' }>

export type InputWithoutComponents = Omit<FunctionInput, 'components'>
export type NonComponentInput = Exclude<FunctionInput, { type: 'tuple[]' }>
export type ComponentInput = Extract<
  FunctionInput,
  { type: 'tuple[]' }
>['components'][number]

export type DecipherableInput =
  | NonComponentInput
  | ComponentInput
  | InputWithoutComponents

export type PreparedInput = Exclude<Prepared, { type: 'tuple[]' }>

export type PreparedComponentInput = Extract<
  Prepared,
  { type: 'tuple[]' }
>['components'][number]
