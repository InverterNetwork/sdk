import formatParameters from '../../utils/formatParameters'
import { Extras, PopPublicClient } from '../../types'
import getRun from './getRun'
import { ExtendedAbiFunction } from '@inverter-network/abis'

// The PreservedProps type is used to preserve the properties of the abiFunction
type PreservedProps<F extends ExtendedAbiFunction> = {
  name: F['name']
  description: F['description']
  inputs: F['inputs']
  outputs: F['outputs']
  stateMutability: F['stateMutability']
}

// This function is used to construct a method from an abiFunction
export default function constructMethod<
  TAbiFunction extends ExtendedAbiFunction,
  Simulate extends boolean = false,
>({
  abiFunction,
  contract,
  extras,
  simulate,
  publicClient,
}: {
  publicClient: PopPublicClient
  abiFunction: TAbiFunction
  contract: any
  extras?: Extras
  simulate?: Simulate
}) {
  // Construct the data preserving the type properties of the abiFunction
  const { description, name, stateMutability, inputs, outputs } =
    abiFunction as PreservedProps<typeof abiFunction>

  // Format the inputs and outputs
  const formattedInputs = formatParameters(inputs),
    formattedOutputs = formatParameters(outputs, simulate)

  // Construct the run function
  const run = getRun({
    name,
    contract,
    stateMutability,
    formattedInputs,
    formattedOutputs,
    extras,
    simulate,
    publicClient,
  })

  // Return the constructed method
  return {
    name,
    description,
    run,
    inputs: formattedInputs,
    outputs: formattedOutputs,
  }
}
