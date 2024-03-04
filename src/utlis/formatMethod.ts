import {
  Itterable,
  MethodKey,
  ModuleKeys,
  ModuleVersionKey,
} from '@inverter-network/abis'
import formatParameters from './formatParameters'
import { MethodArgs, MethodReturn } from '../types/method'
import parseInputs from './parseInputs'
import { ExtrasProp } from '../types/base'

export default function formatMethod<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
  MK extends MethodKey<K, V>,
>(itterable: Itterable<K, V, MK>, contract: any, extrasProp?: ExtrasProp) {
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
    const parsedInputs = parseInputs(formattedInputs, args, extrasProp)
    console.log('PARSED INPUTS', parsedInputs)

    const res = await contract[simulate ? 'simulate' : type][name](parsedInputs)

    return res as MethodReturn<typeof formattedOutputs, typeof type>
  }

  return {
    name,
    description,
    run,
    inputs: formattedInputs,
    outputs: formattedOutputs,
  }
}
