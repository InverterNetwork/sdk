import { MethodMeta } from '@inverter-network/abis'
import { AbiMethodMeta } from './getAbiMethodMetas'
import useDecipher from './useDecipher'
import prepare from './prepare'

type FormayMethodStructProps = AbiMethodMeta & {
  methodMeta: MethodMeta
  contract: any
}

export default function formatMethodStruct({
  name,
  type,
  inputs,
  contract,
  methodMeta,
  outputs,
}: FormayMethodStructProps) {
  const decipher = useDecipher(methodMeta),
    preparedInputs = inputs.map((input) => prepare({ decipher, inout: input })),
    preparedOutputs = outputs.map((output) =>
      prepare({ decipher, inout: output })
    )

  return {
    type,
    run: ({ args, simulate }: { args: any[]; simulate?: boolean }) => {
      return contract[simulate ? 'simulate' : type][name](...args)
    },
    inputs: preparedInputs,
    outputs: preparedOutputs,
  }
}

export type MethodStruct = ReturnType<typeof formatMethodStruct>
