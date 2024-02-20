import { FunctionOutputs } from '@inverter-network/abis'
import { Prepared } from '../utlis/prepare'

export type FunctionOutput = FunctionOutputs[number]

export type OutputWithComponents = Extract<FunctionOutput, { type: 'tuple[]' }>

export type OutputWithoutComponents = Omit<FunctionOutput, 'components'>
export type NonComponentOutput = Exclude<FunctionOutput, { type: 'tuple[]' }>
export type ComponentOutput = Extract<
  FunctionOutput,
  { type: 'tuple[]' }
>['components'][number]

export type DecipherableOutput =
  | NonComponentOutput
  | ComponentOutput
  | OutputWithoutComponents

export type PreparedInput = Exclude<Prepared, { type: 'tuple[]' }>

export type PreparedComponentInput = Extract<
  Prepared,
  { type: 'tuple[]' }
>['components'][number]
