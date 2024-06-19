import { PublicClient, ReadContractParameters } from 'viem'
import { TOKEN_DATA_ABI } from '../constants'
import { Extras, FormattedAbiParameter } from '../../types'
import { Tag } from '@inverter-network/abis'
import { Inverter } from '../../Inverter'
import { DecimalsTagReturn } from '../../types/tag'
import { Split } from 'type-fest-4'

const cacheToken = (
  self: Inverter,
  tag: Tag,
  tokenAddress: `0x${string}`,
  moduleAddress: `0x${string}`,
  decimals: number
) => {
  const key = `${moduleAddress}:${tag}`
  const value = {
    address: tokenAddress,
    decimals,
  }
  self.tokenCache.set(key, value)
}

export default async function ({
  argsOrRes,
  parameters,
  extras,
  tag,
  publicClient,
  contract,
  self,
}: {
  argsOrRes: any[]
  parameters: readonly FormattedAbiParameter[]
  extras?: Extras
  tag?: Tag
  publicClient: PublicClient
  contract?: any
  self?: Inverter
}): Promise<DecimalsTagReturn> {
  if (!tag) throw new Error('No decimals tag provided')

  let tokenAddress: `0x${string}` | undefined
  let decimals: number | undefined

  const [, source, location, name] = tag?.split(':') as Split<Tag, ':'>
  const { readContract } = publicClient
  const cachedToken = self?.tokenCache.get(`${contract?.address}:${tag}`)
  // INTERNAL CASE
  if (!source) {
    decimals = extras?.decimals
    tokenAddress = extras?.defaultToken
  } else if (source === 'params')
    switch (location) {
      case 'exact':
        decimals =
          // check if the value is contained by a non-tuple arg search it based on the index that is has in `inputs`
          argsOrRes[
            parameters.findIndex((parameter) => parameter.name === name)
          ] ||
          // or if there is a tuple arg that contains a parameter with `name`which would provide the decimals
          argsOrRes.find((item) => typeof item === 'object' && name in item)[
            name
          ]

        break
      case 'indirect':
        if (cachedToken) {
          const { decimals: cachedDecimals } = cachedToken
          decimals = cachedDecimals
        } else {
          tokenAddress =
            argsOrRes[
              parameters.findIndex((parameter) => parameter.name === name)
            ]
          if (!tokenAddress) throw new Error('No token address found')
          decimals = <number>await readContract({
            address: tokenAddress,
            abi: TOKEN_DATA_ABI,
            functionName: 'decimals',
          })
          if (self)
            cacheToken(self, tag, tokenAddress, contract?.address, decimals)
        }
        break
    }
  // EXTERNAL CASE
  else if (source === 'contract')
    // ####
    switch (location) {
      case 'indirect':
        if (cachedToken) {
          const { decimals: cachedDecimals } = cachedToken
          decimals = cachedDecimals
        } else {
          tokenAddress = <`0x${string}`>await readContract({
            address: contract?.address,
            abi: contract.abi,
            functionName: name,
          } as ReadContractParameters)
          decimals = <number>await readContract({
            address: tokenAddress,
            abi: TOKEN_DATA_ABI,
            functionName: 'decimals',
          })
          if (self)
            cacheToken(self, tag, tokenAddress, contract?.address, decimals)
        }
        break
      case 'exact':
        if (cachedToken) {
          const { decimals: cachedDecimals } = cachedToken
          decimals = cachedDecimals
        } else {
          tokenAddress = contract?.address
          if (!tokenAddress) throw new Error('No token address found')
          decimals = <number>await readContract({
            address: tokenAddress,
            abi: TOKEN_DATA_ABI,
            functionName: name,
          })
          if (self) {
            cacheToken(self, tag, tokenAddress, contract?.address, decimals)
          }
        }

        break
    }

  if (!decimals) throw new Error('No decimals provided')

  return { decimals, tokenAddress }
}
