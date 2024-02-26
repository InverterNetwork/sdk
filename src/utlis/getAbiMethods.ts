import type { Abi, ModuleKeys, ModuleVersionKeys } from '@inverter-network/abis'

function readFunctions<K extends ModuleKeys, V extends ModuleVersionKeys>(
  abi: Abi<K, V>
) {
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

function writeFunctions<K extends ModuleKeys, V extends ModuleVersionKeys>(
  abi: Abi<K, V>
) {
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

function getAbiEvents<K extends ModuleKeys, V extends ModuleVersionKeys>(
  abi: Abi<K, V>
) {
  return abi.filter(
    (item): item is Extract<typeof item, { type: 'event' }> =>
      item.type === 'event'
  )
}

export default {
  readFunctions,
  writeFunctions,
  getAbiEvents,
}

export type AbiFunctions<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
> = Extract<
  Abi<K, V>,
  {
    type: 'function'
    stateMutability: 'view' | 'pure' | 'nonpayable' | 'payable'
  }
>[number] & { outputs: [] | undefined }
