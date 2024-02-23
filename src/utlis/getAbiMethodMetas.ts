import type { Abi, ModuleKeys, ModuleVersionKeys } from '@inverter-network/abis'
import { isValidAbi } from '../types/guards'

export default function getAbiMethodMetas<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  A extends Abi<K, V>,
>(abi: A) {
  if (!isValidAbi(abi)) throw new Error('Invalid abi')

  const result = abi
    .map((item) => {
      if (item.type !== 'function') return null
      const type: 'read' | 'write' =
        item.stateMutability === 'view' ||
        // @ts-expect-error abis are missing modules
        item.stateMutability === 'pure'
          ? 'read'
          : 'write'

      return { ...item, type }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return result
}

export type AbiMethodMeta = ReturnType<typeof getAbiMethodMetas>[number]
