// external dependencies
import type { ExtendedAbiFunction } from '@inverter-network/abis'

// sdk types
import type {
  EstimateGasOutput,
  GetModuleConstructMethodParams,
  GetModuleConstructMethodReturnType,
  MethodKind,
  WriteOutput,
} from '@/types'

// sdk utils
import { estimateGasOutputs, writeOutputs } from '@/utils'

// get-module utils
import getRun from './get-run'

/**
 * @description Constructs a method from an abiFunction
 * @param abiFunction - The abiFunction to construct the method from
 * @param contract - The contract to construct the method from
 * @param extras - The extras to construct the method from
 * @param kind - The kind of method to construct
 */
export default function constructMethod<
  TAbiFunction extends ExtendedAbiFunction,
  Kind extends MethodKind,
>({
  abiFunction,
  contract,
  tagConfig,
  kind,
  publicClient,
  self,
  walletClient,
}: GetModuleConstructMethodParams<
  TAbiFunction,
  Kind
>): GetModuleConstructMethodReturnType<TAbiFunction, Kind> {
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
  }[kind] as unknown as Kind extends 'read' | 'simulate'
    ? TAbiFunction['outputs']
    : Kind extends 'write'
      ? WriteOutput
      : EstimateGasOutput

  // Construct the run function
  const run = getRun({
    name,
    contract,
    extendedInputs: inputs,
    extendedOutputs: outputsByKind,
    tagConfig,
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
