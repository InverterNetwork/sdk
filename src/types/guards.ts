import {
  ModuleKeys,
  ModuleVersion,
  ModuleVersionKeys,
  Abi,
  MethodMeta,
  MethodKey,
} from '@inverter-network/abis'

export const isString = (value: unknown): value is string =>
  typeof value === 'string'

export function isValidModule<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
>(obj: any): obj is ModuleVersion<K, V> {
  // Implement a check for the properties you expect in ModuleData
  return (
    'moduletype' in obj &&
    'abi' in obj &&
    'description' in obj &&
    'methodMetas' in obj
  )
}

export function isValidAbi<K extends ModuleKeys, V extends ModuleVersionKeys>(
  abi: any
): abi is Abi<K, V> {
  return Array.isArray(abi)
}

export function isValidMethodMeta<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
>(obj: any): obj is MethodMeta<K, V>[MK] {
  // Implement a check for the properties you expect in MethodMeta
  return 'tags' in obj && 'descriptions' in obj
}
