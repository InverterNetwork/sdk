import {
  ModuleKeys,
  ModuleVersion,
  ModuleVersionKey,
} from '@inverter-network/abis'

export function isValidModule<K extends ModuleKeys, V extends ModuleVersionKey>(
  module: any
): module is ModuleVersion<K, V> {
  // Implement a check for the properties you expect in ModuleData
  return (
    'name' in module &&
    'version' in module &&
    'description' in module &&
    'moduleType' in module &&
    'abi' in module
  )
}
