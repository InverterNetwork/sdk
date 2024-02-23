import {
  MethodKey,
  MethodMeta,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'
import { input as prepareInput, output as preparedOutput } from './prepare'
import { AbiMethodMeta } from './getAbiMethodMetas'
import useDecipher from './useDecipher'

export default function formatMethodStruct<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
>({
  name,
  type,
  inputs,
  contract,
  methodMeta,
  outputs,
}: AbiMethodMeta & {
  methodMeta: MethodMeta<K, V>[MK]
  contract: any
}) {
  const decipher = useDecipher(methodMeta),
    preparedInputs = inputs.map((input) => prepareInput(decipher, input)),
    preparedOutputs = outputs.map((output) => preparedOutput(decipher, output))

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
