import {
  PublicClient,
  ReadContractParameters,
  parseUnits,
  stringToHex,
} from 'viem'
import {
  TupleFormattedAbiParameter,
  Extras,
  FormattedAbiParameter,
} from '../../types'
import parse, { TokenCallback } from './parse'
import { Tag } from '@inverter-network/abis'
import { TOKEN_DATA_ABI } from '../constants'
import { InverterSDK } from '../../inverterSdk'

type TupleCaseParams = {
  input: TupleFormattedAbiParameter
  arg: any
  extras?: Extras
  tokenCallback: TokenCallback
}

// TODO: Add error handling, for empty data
export const any = (arg: any) => {
  try {
    stringToHex(JSON.stringify(arg))
  } catch {
    return '0x0'
  }
}

// The case for tuple arguments
export const tuple = async ({
  input,
  arg,
  extras,
  tokenCallback,
}: TupleCaseParams) => {
  const formattedTuple: any = {}
  // iterate over the components of the tuple template
  await Promise.all(
    input.components.map(async (c, index) => {
      // try the name of the component, if it doesn't exist, use the index
      formattedTuple[c.name ?? `_${index}`] = await parse({
        input: c,
        arg: arg[c.name ?? index],
        extras,
        tokenCallback,
      })
    })
  )

  return formattedTuple
}

// The case for tuple[] arguments
export const tupleArray = ({ arg, ...rest }: TupleCaseParams) =>
  arg.map((argI: any) => tuple({ arg: argI, ...rest }))

const cacheToken = (
  self: InverterSDK,
  decimalsTag: Tag,
  tokenAddress: `0x${string}`,
  moduleAddress: `0x${string}`,
  decimals: number
) => {
  const key = `${moduleAddress}:${decimalsTag}`
  const value = {
    address: tokenAddress,
    decimals,
  }
  self.tokenCache.set(key, value)
}

export const processTags = async () => {}

export const tokenInfo = async ({
  arg,
  args,
  inputs,
  extras,
  decimalsTag,
  publicClient,
  contract,
  self,
}: {
  arg: any
  args: any[]
  inputs: FormattedAbiParameter[]
  extras?: Extras
  decimalsTag: Tag
  publicClient: PublicClient
  contract?: any
  self?: InverterSDK
}) => {
  let decimals = extras?.decimals

  const [, source, location, name] = decimalsTag?.split(':')
  const { readContract } = publicClient
  // console.log(self)
  const cachedToken = self?.tokenCache.get(`${contract.address}:${decimalsTag}`)

  if (source === 'internal') {
    switch (location) {
      case 'exact':
        decimals = args[inputs.findIndex((input) => input.name === name)]
        break
      case 'indirect':
        if (cachedToken) {
          const { decimals: cachedDecimals } = cachedToken
          decimals = cachedDecimals
        } else {
          const tokenAddress =
            args[inputs.findIndex((input) => input.name === name)]
          decimals = <number>await readContract({
            address: tokenAddress,
            abi: TOKEN_DATA_ABI,
            functionName: 'decimals',
          })
          if (self)
            cacheToken(
              self,
              decimalsTag,
              tokenAddress,
              contract.address,
              decimals
            )
        }

        break
    }
  } else if (source === 'external') {
    switch (location) {
      case 'indirect':
        if (cachedToken) {
          const { decimals: cachedDecimals } = cachedToken
          decimals = cachedDecimals
        } else {
          const tokenAddress = <`0x${string}`>await readContract({
            address: contract.address,
            abi: contract.abi,
            functionName: name,
          } as ReadContractParameters)
          decimals = <number>await readContract({
            address: tokenAddress,
            abi: TOKEN_DATA_ABI,
            functionName: 'decimals',
          })
          if (self)
            cacheToken(
              self,
              decimalsTag,
              tokenAddress,
              contract.address,
              decimals
            )
        }
        break
      case 'exact':
        if (cachedToken) {
          const { decimals: cachedDecimals } = cachedToken
          decimals = cachedDecimals
        } else {
          decimals = <number>await readContract({
            address: contract.address,
            abi: TOKEN_DATA_ABI,
            functionName: name,
          })
          if (self) {
            cacheToken(
              self,
              decimalsTag,
              contract.address,
              contract.address,
              decimals
            )
          }
        }
        break
    }
  }
  if (!decimals) throw new Error('No decimals provided')
  return parseUnits(arg, decimals)
}
