import constructFunction from './constructFunction'
import { Extras } from '../types/base'
import {
  Abi,
  AbiStateMutability,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype'
import { TupleToUnion } from 'type-fest'

export default function prepareFunction<
  A extends Abi,
  T extends AbiStateMutability[],
>(abi: A, type: T, contract: any, extras?: Extras) {
  type Result = {
    [N in ExtractAbiFunctionNames<typeof abi, TupleToUnion<T>>]: ReturnType<
      typeof constructFunction<ExtractAbiFunction<typeof abi, N>>
    >
  }
  return abi
    .filter((i) => {
      if (i.type === 'function') {
        return type.includes(i.stateMutability)
      }

      return false
    })
    .map((item: any) => constructFunction(item, contract, extras))
    .reduce((acc, item) => {
      acc[item.name] = item
      return acc
    }, {} as any) as Result
}
