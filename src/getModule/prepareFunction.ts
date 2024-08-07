import constructMethod from './constructMethod'
import { Inverter } from '../Inverter'

import type {
  AbiStateMutability,
  ExtractAbiFunctionNames,
  ExtractAbiFunction,
} from 'abitype'
import type { Simplify, TupleToUnion } from 'type-fest-4'
import type { ExtendedAbi, ExtendedAbiFunction } from '@inverter-network/abis'
import type { Extras, PopPublicClient, PopWalletClient } from '../types'

// The prepareFunction function is used to prepare the functions from the abi
export default function prepareFunction<
  A extends ExtendedAbi,
  T extends AbiStateMutability[],
  Simulate extends boolean = false,
>(
  publicClient: PopPublicClient,
  abi: A,
  type: T,
  contract: any,
  extras?: Extras,
  simulate?: Simulate,
  self?: Inverter<any>,
  walletClient?: PopWalletClient
): // The result object type, maps the function names to their return types
Simplify<{
  [N in ExtractAbiFunctionNames<A, TupleToUnion<T>>]: ReturnType<
    // Gets the return type of the constructMethod function
    typeof constructMethod<ExtractAbiFunction<A, N>, Simulate>
  >
}> {
  // Itterate over the abi functions
  const iterated = abi
    // Filter the functions by their stateMutability
    .filter(
      (i): i is ExtendedAbiFunction =>
        i.type === 'function' && type.includes(i.stateMutability)
    )
    // Construct the method per function
    .map((abiFunction) =>
      constructMethod({
        publicClient,
        walletClient,
        abiFunction,
        contract,
        extras,
        simulate,
        self,
      })
    )
    // Reduce the array to an object with the function name as key
    .reduce((acc, item) => {
      acc[item.name] = item
      return acc
      // Cast the object to the result type
    }, {} as any)

  return iterated
}
