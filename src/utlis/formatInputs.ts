import { FunctionInputs, MethodMeta } from '@inverter-network/abis'
import prepareInput, { Prepared } from './prepare'
import useDecipher from './useDecipher'

export default function formatInputs<
  I extends FunctionInputs,
  M extends MethodMeta,
>({ inputs, methodMeta }: { inputs: I; methodMeta: M }) {
  const decipher = useDecipher(methodMeta)
  const preparedInputs: Prepared[] = []

  inputs.forEach((input) =>
    preparedInputs.push(prepareInput({ decipher, inout: input }))
  )

  return { preparedInputs }
}
