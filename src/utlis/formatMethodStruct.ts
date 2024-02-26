import {
  AbiFunction,
  MethodKey,
  MethodMeta,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'
import decipher from './decipher'

export default function formatMethodStruct<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
>(props: {
  abiMethod: AbiFunction<K, V, MK>
  methodMeta: MethodMeta<K, V, MK>
  variant: 'read' | 'write'
  contract: any
}) {
  type MM = typeof props.methodMeta
  const { contract, methodMeta, abiMethod, variant } = props,
    description = methodMeta.descriptions
      .method as MM['descriptions']['method'],
    { name, inputs } = abiMethod

  const decipheredInputs = inputs.map((input) => decipher(input, methodMeta))

  return {
    name,
    description,
    run: ({ args, simulate }: { args: any[]; simulate?: boolean }) => {
      return contract[simulate ? 'simulate' : variant][name](...args)
    },
    inputs: decipheredInputs,
  }
}

// type InputTypes<
//   K extends ModuleKeys,
//   V extends ModuleVersionKeys,
//   MK extends MethodKey<K, V>,
//   I extends ArrayIndices<typeof inputs>,
// > = (typeof inputs)[I]['type'] extends 'tuple[]'
//   ? InputWithComponents<K, V, MK, I, InputWithComponents_Name<K, V, MK, I>>
//   : NonComponentInput<K, V, MK, I, NonComponentInput_Name<K, V, MK, I>>
