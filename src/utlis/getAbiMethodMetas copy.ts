import type {
  Abi,
  MethodKey,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'
import type { ValueOf } from 'type-fest'

export default function getAbiMethodMetas<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  A extends Abi<K, V>,
>(abi: A) {
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

  const redueced = result.reduce(
    (acc, item) => {
      acc[item.name] = item
      return acc
    },
    {} as Record<(typeof result)[number]['name'], (typeof result)[number]>
  )

  return redueced
}

export type AbiMethodMeta<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
> = Extract<ValueOf<ReturnType<typeof getAbiMethodMetas>>, { name: MK }>
