import constructMethod from './construct-method'

import type { AbiStateMutability } from 'abitype'
import type { ExtendedAbi, ExtendedAbiFunction } from '@inverter-network/abis'
import type {
  GetModuleIterateMethodsReturnType,
  GetModuleItterateMethodsParams,
  MethodKind,
} from '../types'

// The prepareFunction function is used to prepare the functions from the abi
export default function iterateMethods<
  A extends ExtendedAbi,
  T extends AbiStateMutability[],
  Kind extends MethodKind,
>({
  publicClient,
  abi,
  type,
  contract,
  kind,
  extras,
  self,
  walletClient,
}: GetModuleItterateMethodsParams<
  A,
  T,
  Kind
>): GetModuleIterateMethodsReturnType<A, T, Kind> {
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
        kind,
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
