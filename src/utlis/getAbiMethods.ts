import type { Abi, ModuleKeys, ModuleVersionKeys } from '@inverter-network/abis'

export function getAbiReadMethods<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
>(abi: Abi<K, V>) {
  return abi.filter(
    (
      item
    ): item is Extract<
      typeof item,
      {
        type: 'function'
        stateMutability: 'view' | 'pure'
      }
    > =>
      item.type === 'function' &&
      ['view', 'pure'].includes(item.stateMutability)
  )
}

export function getAbiWriteMethods<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
>(abi: Abi<K, V>) {
  return abi.filter(
    (
      item
    ): item is Extract<
      typeof item,
      {
        type: 'function'
        stateMutability: 'nonpayable' | 'payable'
      }
    > =>
      item.type === 'function' &&
      ['nonpayable', 'payable'].includes(item.stateMutability)
  )
}

export function getAbiEvents<K extends ModuleKeys, V extends ModuleVersionKeys>(
  abi: Abi<K, V>
) {
  return abi.filter(
    (item): item is Extract<typeof item, { type: 'event' }> =>
      item.type === 'event'
  )
}

export type AbiFunctionMethods<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> = Extract<
  Abi<K, V>,
  {
    type: 'function'
    stateMutability: 'view' | 'pure' | 'nonpayable' | 'payable'
  }
>[number] & { outputs: [] | undefined }

export type AbiReadMethod<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends ReturnType<typeof getAbiReadMethods<K, V>>[number]['name'],
> = Extract<ReturnType<typeof getAbiReadMethods<K, V>>[number], { name: MK }>

export type AbiWriteMethod<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends ReturnType<typeof getAbiWriteMethods<K, V>>[number]['name'],
> = Extract<ReturnType<typeof getAbiWriteMethods<K, V>>[number], { name: MK }>

export type AbiEvent<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends ReturnType<typeof getAbiEvents<K, V>>[number]['name'],
> = Extract<ReturnType<typeof getAbiEvents<K, V>>[number], { name: MK }>
