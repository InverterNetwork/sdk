import { data, getModuleData } from '@inverter-network/abis'
import type { MixedRequestedModules } from '@/types'
import { decodeErrorResult } from 'viem'
import type { Abi } from 'viem'

import { ERC20_ABI } from './constants'

function extractContractCallBlockAsString(errorMessage: any, errorName: any) {
  const block: any = {}

  // Extract the contract address
  const addressMatch = errorMessage.match(/address:\s+([0-9a-fA-Fx]+)/)
  block.address = addressMatch ? addressMatch[1] : null

  // Extract the function name
  const functionMatch = errorMessage.match(
    /function:\s+([a-zA-Z0-9_]+)\((.*)\)/
  )
  block.functionName = functionMatch ? functionMatch[1] : null
  block.functionSignature = functionMatch ? functionMatch[2] : null

  // Extract the arguments
  const argsMatch = errorMessage.match(/args:\s+\((.*)\)/)
  block.args = argsMatch ? argsMatch[1].split(', ') : []

  // Extract the sender address
  const senderMatch = errorMessage.match(/sender:\s+([0-9a-fA-Fx]+)/)
  block.sender = senderMatch ? senderMatch[1] : null

  // Extract the error signature (if available)
  const signatureMatch = errorMessage.match(/0x[a-fA-F0-9]{8}/)
  block.signature = signatureMatch ? signatureMatch[0] : null

  // Extract the docs link
  const docsMatch = errorMessage.match(/Docs:\s+(https?:\/\/[^\s]+)/)
  block.docs = docsMatch ? docsMatch[1] : null

  // Extract the version
  const versionMatch = errorMessage.match(/Version:\s+([^\s]+)/)
  block.version = versionMatch ? versionMatch[1] : null

  // Format as a single string
  return `
    Contract Call Block:
    Error Name: ${errorName}
    Address: ${block.address || 'N/A'}
    Function: ${block.functionName || 'N/A'}
    Function Signature: ${block.functionSignature || 'N/A'}
    Arguments: ${block.args.length > 0 ? block.args.join(', ') : 'N/A'}
    Sender: ${block.sender || 'N/A'}
    Error Signature: ${block.signature || 'N/A'}
    Docs: ${block.docs || 'N/A'}
    Version: ${block.version || 'N/A'}
  `.trim()
}

export const handleError = (
  params: { error: any } & (
    | {
        requestedModules: MixedRequestedModules
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
      return new Error(
        extractContractCallBlockAsString(
          error?.message,
          'ERC20InsufficientAllowance'
        )
      )
    case '0xe450d38c':
      return new Error(
        extractContractCallBlockAsString(
          error?.message,
          'ERC20InsufficientBalance'
        )
      )
  }

  let errorName: string | undefined

  const srcAbis = (() => {
    let abis: any[] = [ERC20_ABI]

    if ('abi' in params) abis = [...abis, params.abi]

    if ('requestedModules' in params)
      abis = [
        getModuleData('OrchestratorFactory_v1').abi,
        ...abis,
        ...Object.values(params.requestedModules)
          .flat()
          .map((i) => (typeof i === 'object' ? i.abi : getModuleData(i).abi)),
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

  return new Error(extractContractCallBlockAsString(error?.message, errorName))
}

export const handleErrorWithUnknownContext = (error: any) => {
  const allAbis = data.map((i) => i.abi)

  let errorName: string | undefined

  try {
    for (const abi of allAbis) {
      const errors = abi.filter((i) => i.type === 'error')

      const value = decodeErrorResult({
        abi: errors,
        data: error.cause.signature,
      })

      if (value.errorName) {
        errorName = value.errorName
      }
    }
  } catch (e) {
    // do nothing
  }

  return new Error(extractContractCallBlockAsString(error?.message, errorName))
}
