import { MethodMetas } from '@inverter-network/abis'
import { AbiMethodMeta } from './getAbiMethodMetas'
import useDecipher from './useDecipher'
import prepare from './prepare'

type NameKey = keyof MethodMetas

type FormayMethodStructProps<N extends NameKey> = AbiMethodMeta & {
  methodMeta: MethodMetas[N]
  contract: any
}

export default function formatMethodStruct<N extends NameKey>({
  name,
  type,
  inputs,
  contract,
  methodMeta,
  outputs,
}: FormayMethodStructProps<N>) {
  const decipher = useDecipher(methodMeta),
    preparedInputs = inputs.map((input) => prepare(decipher).input(input)),
    preparedOutputs = outputs.map((output) => prepare(decipher).output(output))

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
