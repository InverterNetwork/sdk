import {
  getModuleData,
  type ExtendedAbiParameter,
} from '@inverter-network/abis'
import type { JsType, RequestedModules } from '../types'
import type { Entries } from 'type-fest-4'
import { decodeErrorResult, type Abi } from 'viem'
import { ERC20_ABI } from './constants'

export const getJsType = (
  parameter: ExtendedAbiParameter
): JsType | undefined => {
  const { type } = parameter

  // If the parameter has a tag, format it ( this needs to come first )
  if ('tags' in parameter) {
    const { tags } = parameter

    if (tags?.includes('any')) return 'any'
  }

  // Simplify the type of the parameter, to typescript types, into the jsType property
  if (type === 'bool') return 'boolean'
  if (type === 'bool[]') return 'boolean[]'
  if (type === 'address') return '0xstring'
  if (type === 'address[]') return '0xstring[]'
  if (/^u?int(?!.*\]$)/.test(type)) return 'numberString'
  if (/^u?int.*\[\]$/.test(type)) return 'numberString[]'
  if (/^bytes(?!.*\]$)/.test(type)) return '0xstring'
  if (/^bytes.*\[\]$/.test(type)) return '0xstring[]'

  return
}

export const getEntries = <T extends object>(obj: T): Entries<T> =>
  Object.entries(obj) as any

export const getValues = <T extends object>(obj: T): T[keyof T][] =>
  Object.values(obj)

export const handleError = (
  params: { error: any } & (
    | {
        requestedModules: RequestedModules
      }
    | {
        abi: Abi
      }
  )
) => {
  const { error } = params
  if (!error?.message?.includes?.('Unable to decode signature'))
    return error as Error
  const signature = error.cause.signature as `0x${string}`

  let errorName: string | undefined

  const srcAbis = (() => {
    let abis: any[] = []

    if ('abi' in params) abis = [...abis, params.abi]

    if ('requestedModules' in params)
      abis = Object.values(params.requestedModules)
        .flat()
        .map((i) => getModuleData(i).abi)

    return abis
  })()

  const errors = [
    ...srcAbis,
    ERC20_ABI,
    getModuleData('OrchestratorFactory_v1').abi,
    getModuleData('Restricted_PIM_Factory_v1').abi,
  ]
    .flat()
    .filter((i) => i.type === 'error')

  try {
    const value = decodeErrorResult({
      abi: errors,
      data: signature,
    })

    if (value.errorName) {
      errorName = value.errorName
    }
  } catch (e) {
    // do nothing
  }

  if (!errorName) return error as Error

  return new Error(errorName)
}
