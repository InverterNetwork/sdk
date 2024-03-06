import { Abi, ModuleKeys, ModuleVersionKey } from '@inverter-network/abis'
import formatMethod from './formatMethod'
import { Extras } from '../types/base'
import { AbiStateMutability, ExtractAbiFunctionNames } from 'abitype'
import { TupleToUnion } from 'type-fest'

export default function prepare<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
  T extends AbiStateMutability[],
>(abi: Abi<K, V>, type: T, contract: any, extras?: Extras) {
  type Result = {
    [N in ExtractAbiFunctionNames<Abi<K, V>, TupleToUnion<T>>]: ReturnType<
      typeof formatMethod<K, V, N>
    >
  }
  return abi
    .filter((i) => {
      if (i.type === 'function') {
        return type.includes(i.stateMutability)
      }

      return false
    })
    .map((item: any) => formatMethod(item, contract, extras))
    .reduce((acc, item) => {
      acc[item.name] = item
      return acc
    }, {} as any) as Result
}
