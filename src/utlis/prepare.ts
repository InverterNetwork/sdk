import { Decipher } from './useDecipher'
import { Tuple } from '../types/base'
import {
  FunctionInput,
  FunctionOutput,
  MethodKey,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'

export const input = <
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
>(
  decipher: Decipher<K, V, MK>,
  input: FunctionInput<K, V, MK>
) => {
  const tupleGuard = (i: typeof input): i is Extract<typeof input, Tuple> =>
    i.type === 'tuple[]'

  if (tupleGuard(input)) {
    const { components, ...rest } = input

    return {
      // Decipher the rest of the item
      ...decipher.input(rest),
      // Decipher the components
      components: components.map((tupleItem) => decipher.input(tupleItem)),
    }
  }

  // Decipher the item
  return decipher.input(input as Exclude<typeof input, Tuple>)
}

export const output = <
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
>(
  decipher: Decipher<K, V, MK>,
  output: FunctionOutput<K, V, MK>
) => {
  // If the item is a tuple[] then we need to decipher the components
  const tupleGuard = (i: typeof output): i is Extract<typeof output, Tuple> =>
    i.type === 'tuple'

  if (tupleGuard(output)) {
    const { components, ...rest } = output

    return {
      // Decipher the rest of the item
      ...decipher.output(rest),
      // Decipher the components
      components: components.map((tupleItem) => decipher.output(tupleItem)),
    }
  }

  // Decipher the item
  return decipher.output(output as Exclude<typeof output, Tuple>)
}

export type Input = ReturnType<typeof input>
export type Output = ReturnType<typeof output>
