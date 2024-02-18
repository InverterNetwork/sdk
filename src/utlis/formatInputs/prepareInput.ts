import { Inputs } from '.'
import { Decipher } from './useDecipher'

export default function prepareInput({
  decipher,
  input,
}: {
  decipher: Decipher
  input: Inputs[number]
}) {
  const prepared = (() => {
    // If the item is a tuple[] then we need to decipher the components
    if (input.type === 'tuple[]') {
      const { components, ...rest } = input
      return {
        // Decipher the rest of the item
        ...decipher(rest),
        // Decipher the components
        components: components.map((tupleItem) => decipher(tupleItem)),
      }
    }

    // Decipher the item
    return decipher(input)
  })()

  return prepared
}

export type PreparedInput = ReturnType<typeof prepareInput>
