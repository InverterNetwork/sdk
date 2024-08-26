import { getModuleData } from '@inverter-network/abis'
import type { RequestedModules } from '@/types'
import { decodeErrorResult, type Abi } from 'viem'
import { ERC20_ABI } from './constants'

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

  switch (signature) {
    case '0xfb8f41b2':
      return new Error('ERC20InsufficientAllowance')
  }

  let errorName: string | undefined

  const srcAbis = (() => {
    let abis: any[] = [ERC20_ABI]

    if ('abi' in params) abis = [...abis, params.abi]

    if ('requestedModules' in params)
      abis = [
        getModuleData('OrchestratorFactory_v1').abi,
        getModuleData('Restricted_PIM_Factory_v1').abi,
        ...abis,
        ...Object.values(params.requestedModules)
          .flat()
          .map((i) => getModuleData(i).abi),
      ]

    return abis
  })()

  const errors = srcAbis.flat().filter((i) => i.type === 'error')

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
