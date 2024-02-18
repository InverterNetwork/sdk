import type { Abi } from '@inverter-network/abis'

export default function getAbiMethodMetas<A extends Abi>(abi: A) {
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
