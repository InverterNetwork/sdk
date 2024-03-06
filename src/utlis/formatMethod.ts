import { Abi, ModuleKeys, ModuleVersionKey } from '@inverter-network/abis'
import formatParameters from './formatParameters'
import { MethodArgs, MethodReturn } from '../types/method'
import parseInputs from './parseInputs'
import { Extras } from '../types/base'
import formatOutputs from './formatOutputs'
import { ExtractAbiFunction, ExtractAbiFunctionNames } from 'abitype'

export default function formatMethod<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
  FN extends ExtractAbiFunctionNames<Abi<K, V>>,
>(
  abiFunction: ExtractAbiFunction<Abi<K, V>, FN>,
  contract: any,
  extras?: Extras
) {
  type T = typeof abiFunction
  const { name, stateMutability, inputs, outputs } = abiFunction as unknown as {
      name: T['name']
      stateMutability: T['stateMutability']
      inputs: T['inputs']
      outputs: T['outputs']
    },
    description =
      'description' in abiFunction ? abiFunction.description : undefined,
    kind = ['view', 'pure'].includes(stateMutability) ? 'read' : 'write'

  const formattedInputs = formatParameters(inputs),
    formattedOutputs = formatParameters(outputs)

  const run = async (
    args: MethodArgs<typeof formattedInputs>,
    simulate?: boolean
  ) => {
    const parsedInputs = parseInputs(formattedInputs, args, extras)

    const res =
        await contract[simulate ? 'simulate' : kind][name](parsedInputs),
      formattedRes = formatOutputs(formattedOutputs, res, extras)

    return formattedRes as MethodReturn<
      typeof formattedOutputs,
      typeof stateMutability
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
