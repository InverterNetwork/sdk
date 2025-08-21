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

import decodeBytecodeResult from './decode-bytecode-result'
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
  TMethodKind extends MethodKind,
  TUseTags extends boolean = true,
>({
  abiFunction,
  contract,
  tagConfig,
  kind,
  publicClient,
  self,
  walletClient,
  useTags = true as TUseTags,
}: GetModuleConstructMethodParams<
  TAbiFunction,
  TMethodKind,
  TUseTags
>): GetModuleConstructMethodReturnType<TAbiFunction, TMethodKind, TUseTags> {
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
    bytecode: writeOutputs,
    write: writeOutputs,
    estimateGas: estimateGasOutputs,
  }[kind] as unknown as TMethodKind extends 'read' | 'simulate'
    ? TAbiFunction['outputs']
    : TMethodKind extends 'write'
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
    useTags,
  })

  const decodeResult = (res: any) =>
    decodeBytecodeResult({
      extendedOutputs: outputs,
      res,
      tagConfig,
      publicClient,
      contract,
      self,
      functionName: name,
      useTags,
    })

  const baseReturn = {
    name,
    description,
    inputs,
    outputs: outputsByKind,
    run,
  }

  if (kind === 'bytecode') {
    Object.assign(baseReturn, { decodeResult })
  }

  return baseReturn as GetModuleConstructMethodReturnType<
    TAbiFunction,
    TMethodKind,
    TUseTags
  >
}
