// external dependencies
import type { ExtendedAbi, ExtendedAbiFunction } from '@inverter-network/abis'
// sdk types
import type {
  GetModuleIterateMethodsReturnType,
  GetModuleItterateMethodsParams,
  MethodKind,
} from '@/types'
import type { AbiStateMutability } from 'abitype'

// get-module utils
import constructMethod from './construct-method'

/**
 * @description Iterates over the abi functions and constructs the methods
 * @param params - The parameters for the iterateMethods function
 * @returns The methods
 */
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
  tagConfig,
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
        tagConfig,
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
