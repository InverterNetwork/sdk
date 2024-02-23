import {
  FunctionInput,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'
import { Tuple } from './base'
import { Input } from '../utlis/prepare'

type InputWithComponents<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> = Extract<FunctionInput<K, V>, Tuple>

export type NonComponentInput<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> = Exclude<FunctionInput<K, V>, Tuple>

export type InputOmittedComponents<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> = Omit<InputWithComponents<K, V>, 'components'>

export type ComponentInput<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> = InputWithComponents<K, V>['components'][number]

export type DecipherableInput<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> =
  | NonComponentInput<K, V>
  | ComponentInput<K, V>
  | InputOmittedComponents<K, V>

export type PreparedInput = Exclude<Input, Tuple>

export type PreparedComponentInput = Extract<Input, Tuple>
