import {
  AbiFunction,
  Description,
  MethodKey,
  MethodMeta,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'
import { input as prepareInput, output as preparedOutput } from './prepare'
import useDecipher from './useDecipher'

export default function formatMethodStruct<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
  MM extends MethodMeta<K, V, MK> = MethodMeta<K, V, MK>,
>(props: {
  abiMethod: AbiFunction<K, V, MK>
  methodMeta: MM
  type: 'write' | 'read'
  contract: any
}) {
  const { contract, methodMeta, abiMethod, type } = props
  const { name, inputs, outputs } = abiMethod

  const decipher = useDecipher<K, V, MK>(methodMeta),
    preparedInputs = inputs.map((input) => prepareInput(decipher, input)),
    preparedOutputs = outputs.map((output) => preparedOutput(decipher, output))

  return {
    name,
    description: methodMeta.descriptions.method as MM['descriptions']['method'],
    run: ({ args, simulate }: { args: any[]; simulate?: boolean }) => {
      return contract[simulate ? 'simulate' : type][name](...args)
    },
    inputs: preparedInputs,
    outputs: preparedOutputs,
  }
}

export type MethodStruct<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
> = ReturnType<typeof formatMethodStruct<K, V, MK>>
