import {
  Itterable,
  MethodKey,
  ModuleKeys,
  ModuleVersionKey,
} from '@inverter-network/abis'
import formatParameters from './formatParameters'
import { MethodArgs, MethodResult } from '../types/method'
import parseInputs from './parseInputs'

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

  const formattedInputs = formatParameters<K, V, MK, 'inputs'>(inputs),
    formattedOutputs = formatParameters<K, V, MK, 'outputs'>(outputs)

  const run = async (
    args: MethodArgs<typeof formattedInputs>,
    simulate?: boolean
  ) => {
    const parsedInputs = parseInputs(formattedInputs, args)
    const res = await contract[simulate ? 'simulate' : type][name](parsedInputs)

    return (itterable.type === 'read' ? res[0] : res) as MethodResult<
      typeof formattedOutputs
    >
  }

  return {
    name,
    description,
    run,
    inputs: formattedInputs,
    outputs: formattedOutputs,
  }
}
