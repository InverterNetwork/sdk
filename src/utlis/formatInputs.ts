import { FunctionInputs, MethodMeta } from '@inverter-network/abis'
import useDecipher from './useDecipher'

export default function formatInputs<
  I extends FunctionInputs,
  M extends MethodMeta,
>({ inputs, methodMeta }: { inputs: I; methodMeta: M }) {
  const decipher = useDecipher(methodMeta)

  inputs.forEach((input) => {})

  return {}
}
