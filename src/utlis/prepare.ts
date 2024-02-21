import { Decipher } from './useDecipher'
import { FunctionInput } from '../types/input'
import { Tuple } from '../types/base'
import { FunctionOutput } from '../types/output'

export default function prepare(decipher: Decipher) {
  // If the item is a tuple[] then we need to decipher the components

  const input = <I extends FunctionInput>(input: I) => {
    const tupleGuard = (i: I): i is Extract<I, Tuple> => i.type === 'tuple[]'

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
    return decipher.input(input)
  }

  const output = <O extends FunctionOutput>(output: O) => {
    const tupleGuard = (i: O): i is Extract<O, Tuple> =>
      i.type === 'tuple[]' || i.type === 'tuple'

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
    return decipher.output(output)
  }

  return { input, output }
}

export type Prepare = ReturnType<typeof prepare>
