import { FunctionOutputs } from '@inverter-network/abis'
import { Prepare } from '../utlis/prepare'
import { Tuple } from './base'

export type FunctionOutput = FunctionOutputs[number]

type OutputWithComponents = Extract<FunctionOutput, Tuple>

export type OutputOmittedComponents = Omit<OutputWithComponents, 'components'>
export type NonComponentOutput = Exclude<FunctionOutput, Tuple>
export type ComponentOutput = OutputWithComponents['components'][number]

export type DecipherableOutput =
  | NonComponentOutput
  | ComponentOutput
  | OutputOmittedComponents

export type PreparedOutput = Exclude<ReturnType<Prepare['output']>, Tuple>

export type PreparedComponentOutput = Extract<
  ReturnType<Prepare['output']>,
  { type: 'tuple[]' }
>['components'][number]
