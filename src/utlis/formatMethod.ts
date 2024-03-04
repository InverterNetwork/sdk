import {
  Itterable,
  MethodKey,
  ModuleKeys,
  ModuleVersionKey,
} from '@inverter-network/abis'
import formatInputs from './formatInputs'
import { MethodArgs } from '../types/method'
import parseInputs from './parseInputs'
import { AbiParametersToPrimitiveTypes } from 'abitype'

export default function formatMethod<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
  MK extends MethodKey<K, V>,
>(itterable: Itterable<K, V, MK>, contract: any) {
  type T = typeof itterable
  const name = itterable.name,
    description = itterable.description as T['description'],
    type = itterable.type as T['type'],
    inputs = itterable.inputs as T['inputs'],
    outputs = itterable.outputs as T['outputs']

  const formattedInputs = formatInputs<K, V, MK>(inputs)

  const run = async (
    args: MethodArgs<typeof formattedInputs>,
    simulate?: boolean
  ) => {
    const parsedInputs = parseInputs(formattedInputs, args)
    const res = await contract[simulate ? 'simulate' : type][name](parsedInputs)

    return (
      itterable.type === 'write' ? res[0] : res
    ) as AbiParametersToPrimitiveTypes<typeof outputs, 'outputs'>[0]
  }

  return {
    name,
    description,
    run,
    inputs: formattedInputs,
    outputs: outputs,
  }
}
