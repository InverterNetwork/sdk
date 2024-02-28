import {
  ModuleKeys,
  ModuleVersion,
  ModuleVersionKey,
  Abi,
} from '@inverter-network/abis'

export const isString = (value: unknown): value is string =>
  typeof value === 'string'

export function isValidModule<K extends ModuleKeys, V extends ModuleVersionKey>(
  obj: any
): obj is ModuleVersion<K, V> {
  // Implement a check for the properties you expect in ModuleData
  return (
    'moduletype' in obj &&
    'abi' in obj &&
    'description' in obj &&
    'methodMetas' in obj
  )
}

export function isValidAbi<K extends ModuleKeys, V extends ModuleVersionKey>(
  abi: any
): abi is Abi<K, V> {
  return Array.isArray(abi)
}
