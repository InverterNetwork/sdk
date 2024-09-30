import getRun from './getRun'

import type { GetModuleConstructMethodParams, MethodKind } from '@/types'
import type { ExtendedAbiFunction } from '@inverter-network/abis'
import { estimateGasOutputs, writeOutputs } from '@/utils'

// This function is used to construct a method from an abiFunction
export default function constructMethod<
  TAbiFunction extends ExtendedAbiFunction,
  Kind extends MethodKind,
>({
  abiFunction,
  contract,
  extras,
  kind,
  publicClient,
  self,
  walletClient,
}: GetModuleConstructMethodParams<TAbiFunction, Kind>) {
  // Construct the data preserving the type properties of the abiFunction
  const {
    description,
    name,
    inputs,
    outputs,
  }: Pick<TAbiFunction, keyof TAbiFunction> = abiFunction

  const outputsByKind = {
    read: outputs,
    simulate: outputs,
    write: writeOutputs,
    estimateGas: estimateGasOutputs,
  }[kind]

  // Construct the run function
  const run = getRun({
    name,
    contract,
    extendedInputs: inputs,
    extendedOutputs: outputsByKind,
    extras,
    kind,
    walletClient,
    publicClient,
    self,
  })

  return {
    name,
    description,
    inputs,
    outputs: outputsByKind,
    run,
  }
}
