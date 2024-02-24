import {
  FunctionInput,
  MethodKey,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'
import { Tuple } from './base'
import { Input } from '../utlis/prepare'

type InputWithComponents<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
> = Extract<FunctionInput<K, V, MK>, Tuple>

type NonComponentInput<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
> = Exclude<FunctionInput<K, V, MK>, Tuple>

type InputOmittedComponents<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
> = Omit<InputWithComponents<K, V, MK>, 'components'>

export type ComponentInput<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
> = InputWithComponents<K, V, MK>['components'][number]

export type DecipherableInput<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
> =
  | NonComponentInput<K, V, MK>
  | ComponentInput<K, V, MK>
  | InputOmittedComponents<K, V, MK>

export type PreparedInput = Exclude<Input, Tuple>

export type PreparedComponentInput = Extract<Input, Tuple>
