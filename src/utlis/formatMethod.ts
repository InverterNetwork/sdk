import {
  Itterable,
  MethodKey,
  ModuleKeys,
  ModuleVersionKey,
} from '@inverter-network/abis'
import formatParameters from './formatParameters'
import { FormatParametersToPrimitiveTypes } from '../types/parameter'

export default function formatMethod<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
  MK extends MethodKey<K, V>,
>(itterable: Itterable<K, V, MK>, contract: any) {
  type T = typeof itterable
  const name = itterable.name,
    description = itterable.description as T['description'],
    type = itterable.type as T['type'],
    inputs = formatParameters<K, V, MK, 'inputs'>(
      itterable.inputs as T['inputs']
    ),
    outputs = formatParameters<K, V, MK, 'outputs'>(
      itterable.outputs as T['outputs']
    )

  const run = (
    args: FormatParametersToPrimitiveTypes<typeof inputs>,
    simulate?: boolean
  ): Promise<typeof outputs> => {
    return contract[simulate ? 'simulate' : type][name](args)
  }

  return {
    name,
    description,
    run,
    inputs,
    outputs,
  }
}
