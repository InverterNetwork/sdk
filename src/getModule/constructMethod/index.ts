import getRun from './getRun'
import { Inverter } from '../../Inverter'

import type {
  Extras,
  MethodKind,
  PopPublicClient,
  PopWalletClient,
} from '../../types'
import type { ExtendedAbiFunction } from '@inverter-network/abis'

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
  Kind extends MethodKind,
>({
  abiFunction,
  contract,
  extras,
  kind,
  publicClient,
  self,
  walletClient,
}: {
  walletClient?: PopWalletClient
  publicClient: PopPublicClient
  abiFunction: TAbiFunction
  contract: any
  extras?: Extras
  kind: Kind
  self?: Inverter
}) {
  // Construct the data preserving the type properties of the abiFunction
  const { description, name, inputs, outputs } = abiFunction as PreservedProps<
    typeof abiFunction
  >

  // Construct the run function
  const run = getRun({
    name,
    contract,
    extendedInputs: inputs,
    extendedOutputs: outputs,
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
    outputs,
    run,
  }
}
