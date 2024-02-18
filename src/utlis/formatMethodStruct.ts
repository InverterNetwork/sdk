import { MethodMeta } from '@inverter-network/abis'
import { AbiMethodMeta } from './getAbiMethodMetas'
import formatInputs from './formatInputs'

type FormayMethodStructProps = AbiMethodMeta & {
  methodMeta: MethodMeta
  contract: any
}

export default function formatMethodStruct({
  name,
  type,
  inputs,
  outputs,
  contract,
  methodMeta,
}: FormayMethodStructProps) {
  const formattedInputs = formatInputs({ inputs, methodMeta })

  return {
    type,
    run: ({ args, simulate }: { args: any[]; simulate?: boolean }) => {
      return contract[simulate ? 'simulate' : type][name](...args)
    },
    inputs: formattedInputs,
    outputs,
  }
}

export type MethodStruct = ReturnType<typeof formatMethodStruct>
