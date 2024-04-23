import {
  TupleFormattedAbiParameter,
  NonTupleFormattedAbiParameter,
} from './parameter'

// TODO: Becomes useful when you have multiple versions of a module
// export function isValidModule<K extends ModuleKeys, V extends ModuleVersionKey>(
//   module: any
// ): module is ModuleVersion<K, V> {
//   // Implement a check for the properties you expect in ModuleData
//   return (
//     'name' in module &&
//     'version' in module &&
//     'description' in module &&
//     'moduleType' in module &&
//     'abi' in module
//   )
// }

export const isTupleFormattedAbiParameter = (
  result: any
): result is TupleFormattedAbiParameter => {
  return result.type === 'tuple' || result.type === 'tuple[]'
}

export const isNonTupleFormattedAbiParameter = (
  result: any
): result is NonTupleFormattedAbiParameter => {
  return !isTupleFormattedAbiParameter(result)
}
