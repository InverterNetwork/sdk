import { AbiFunctions, MethodMeta } from '@inverter-network/abis'
import useDecipher from './useDecipher'
import prepareInput, { PreparedInput } from './prepareInput'

export type Inputs = AbiFunctions['inputs']

export default function formatInputs<I extends Inputs, M extends MethodMeta>({
  inputs,
  methodMeta,
}: {
  inputs: I
  methodMeta: M
}) {
  const decipher = useDecipher({ methodMeta })
  const preparedInputs: PreparedInput[] = []

  inputs.forEach((input) =>
    preparedInputs.push(prepareInput({ decipher, input }))
  )

  return preparedInputs
}
