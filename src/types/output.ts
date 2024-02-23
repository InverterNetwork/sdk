import {
  FunctionOutput,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'
import { Tuple } from './base'
import { Output } from '../utlis/prepare'

type OutputWithComponents<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> = Extract<FunctionOutput<K, V>, Tuple>

export type NonComponentOutput<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> = Exclude<FunctionOutput<K, V>, Tuple>

export type OutputOmittedComponents<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> = Omit<OutputWithComponents<K, V>, 'components'>

export type ComponentOutput<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> = OutputWithComponents<K, V>['components'][number]

export type DecipherableOutput<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> =
  | NonComponentOutput<K, V>
  | ComponentOutput<K, V>
  | OutputOmittedComponents<K, V>

export type PreparedOutput = Exclude<Output, Tuple>

export type PreparedComponentOutput = Extract<Output, Tuple>['components']
