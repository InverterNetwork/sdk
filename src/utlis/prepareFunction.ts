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
  Simulate extends boolean = false,
>(abi: A, type: T, contract: any, extras?: Extras, simulate?: Simulate) {
  type Result = {
    [N in ExtractAbiFunctionNames<A, TupleToUnion<T>>]: ReturnType<
      typeof constructFunction<ExtractAbiFunction<A, N>, Simulate>
    >
  }
  return abi
    .filter((i) => {
      if (i.type === 'function') {
        return type.includes(i.stateMutability)
      }

      return false
    })
    .map((item: any) => constructFunction(item, contract, extras, simulate))
    .reduce((acc, item) => {
      acc[item.name] = item
      return acc
    }, {} as any) as Result
}
