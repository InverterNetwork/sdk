import {
  Itterable,
  MethodKey,
  ModuleKeys,
  ModuleVersionKey,
} from '@inverter-network/abis'
import formatParameters from './formatParameters'
import { MethodArgs, MethodReturn } from '../types/method'
import parseInputs from './parseInputs'
import { Extras } from '../types/base'
import formatOutputs from './formatOutputs'

export default function formatMethod<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
  MK extends MethodKey<K, V>,
>(itterable: Itterable<K, V, MK>, contract: any, extras?: Extras) {
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
    const parsedInputs = parseInputs(formattedInputs, args, extras)

    const res =
        await contract[simulate ? 'simulate' : type][name](parsedInputs),
      formattedRes = formatOutputs(formattedOutputs, res, extras)

    return formattedRes as MethodReturn<typeof formattedOutputs, typeof type>
  }

  return {
    name,
    description,
    run,
    inputs: formattedInputs,
    outputs: formattedOutputs,
  }
}
