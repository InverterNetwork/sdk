import constructMethod from './constructMethod'
import { Extras } from '../types/base'
import {
  Abi,
  AbiStateMutability,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype'
import { TupleToUnion } from 'type-fest'

// The prepareFunction function is used to prepare the functions from the abi
export default function prepareFunction<
  A extends Abi,
  T extends AbiStateMutability[],
  Simulate extends boolean = false,
>(abi: A, type: T, contract: any, extras?: Extras, simulate?: Simulate) {
  // The result object type, maps the function names to their return types
  type Result = {
    [N in ExtractAbiFunctionNames<A, TupleToUnion<T>>]: ReturnType<
      // Gets the return type of the constructMethod function
      typeof constructMethod<ExtractAbiFunction<A, N>, Simulate>
    >
  }

  // Itterate over the abi functions
  const itterated = abi
    // Filter the functions by their stateMutability
    .filter((i) =>
      i.type === 'function' ? type.includes(i.stateMutability) : false
    )
    // Construct the method per function
    .map((item: any) => constructMethod(item, contract, extras, simulate))
    // Reduce the array to an object with the function name as key
    .reduce((acc, item) => {
      acc[item.name] = item
      return acc
      // Cast the object to the result type
    }, {} as any) as Result

  return itterated
}
