import { Decipher } from './useDecipher'
import { isInoutWithComponents } from '../types/guards'
import { FunctionOutput } from '../types/output'
import { FunctionInput } from '../types/input'

export default function prepare<T extends FunctionInput | FunctionOutput>({
  decipher,
  inout,
}: {
  decipher: Decipher
  inout: T
}) {
  // If the item is a tuple[] then we need to decipher the components
  if (isInoutWithComponents(inout)) {
    const { components, ...rest } = inout
    return {
      // Decipher the rest of the item
      ...decipher(rest),
      // Decipher the components
      components: components.map((tupleItem) => decipher(tupleItem)),
    }
  }

  // Decipher the item
  return decipher(inout)
}

export type Prepared = ReturnType<typeof prepare>
