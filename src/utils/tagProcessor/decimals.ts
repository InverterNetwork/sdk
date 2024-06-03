import { PublicClient, ReadContractParameters } from 'viem'
import { TOKEN_DATA_ABI } from '../constants'
import { Extras, FormattedAbiParameter } from '../../types'
import { Tag } from '@inverter-network/abis'
import { InverterSDK } from '../../InverterSDK'
import { DecimalsTagReturn } from '../../types/tag'

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

export default async function ({
  args,
  inputs,
  extras,
  decimalsTag,
  publicClient,
  contract,
  self,
}: {
  args: any[]
  inputs: readonly FormattedAbiParameter[]
  extras?: Extras
  decimalsTag?: Tag
  publicClient: PublicClient
  contract?: any
  self?: InverterSDK
}): Promise<DecimalsTagReturn> {
  if (!decimalsTag) throw new Error('No decimals tag provided')

  let tokenAddress: `0x${string}` | undefined
  let decimals: number | undefined

  const [, source, location, name] = decimalsTag?.split(':')
  const { readContract } = publicClient
  const cachedToken = self?.tokenCache.get(`${contract.address}:${decimalsTag}`)
  // INTERNAL CASE
  if (!source) {
    decimals = extras?.decimals
    tokenAddress = extras?.defaultToken
  } else if (source === 'internal')
    switch (location) {
      case 'exact':
        decimals =
          // check if the value is contained by a non-tuple arg search it based on the index that is has in `inputs`
          args[inputs.findIndex((input) => input.name === name)] ||
          // or if there is a tuple arg that contains a parameter with `name`which would provide the decimals
          args.find((item) => typeof item === 'object' && name in item)[name]

        break
      case 'indirect':
        if (cachedToken) {
          const { decimals: cachedDecimals } = cachedToken
          decimals = cachedDecimals
        } else {
          tokenAddress = args[inputs.findIndex((input) => input.name === name)]
          if (!tokenAddress) throw new Error('No token address found')
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
  // EXTERNAL CASE
  else if (source === 'external')
    // ####
    switch (location) {
      case 'indirect':
        if (cachedToken) {
          const { decimals: cachedDecimals } = cachedToken
          decimals = cachedDecimals
        } else {
          tokenAddress = <`0x${string}`>await readContract({
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
          tokenAddress = contract.address
          if (!tokenAddress) throw new Error('No token address found')
          decimals = <number>await readContract({
            address: tokenAddress,
            abi: TOKEN_DATA_ABI,
            functionName: name,
          })
          if (self) {
            cacheToken(
              self,
              decimalsTag,
              tokenAddress,
              contract.address,
              decimals
            )
          }
        }

        break
    }

  if (!decimals) throw new Error('No decimals provided')

  return { decimals, tokenAddress }
}
