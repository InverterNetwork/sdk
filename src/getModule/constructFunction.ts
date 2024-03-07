import formatParameters from './formatParameters'
import { MethodArgs, MethodReturn } from '../types/method'
import parseInputs from './parseInputs'
import { Extras } from '../types/base'
import formatOutputs from './formatOutputs'
import { AbiFunction } from 'abitype'

type ExtendedAbiFunction = AbiFunction & {
  description?: string
}

interface PreservedProps<F extends ExtendedAbiFunction> {
  name: F['name']
  description: F['description']
  inputs: F['inputs']
  outputs: F['outputs']
  stateMutability: F['stateMutability']
}

export default function constructFunction<
  F extends ExtendedAbiFunction,
  Simulate extends boolean = false,
>(abiFunction: F, contract: any, extras?: Extras, simulate?: Simulate) {
  type T = typeof abiFunction
  const { description, name, stateMutability, inputs, outputs } =
      abiFunction as PreservedProps<T>,
    kind = ['view', 'pure'].includes(stateMutability) ? 'read' : 'write'

  const formattedInputs = formatParameters(inputs),
    formattedOutputs = formatParameters(outputs, simulate)

  const run = async (args: MethodArgs<typeof formattedInputs>) => {
    const parsedInputs = parseInputs(formattedInputs, args, extras)

    const res =
        await contract[simulate ? 'simulate' : kind][name](parsedInputs),
      formattedRes = formatOutputs(formattedOutputs, res, extras)

    return formattedRes as MethodReturn<
      typeof formattedOutputs,
      typeof stateMutability,
      Simulate
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
