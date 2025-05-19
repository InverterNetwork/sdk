// external dependencies
import type { Tag } from '@inverter-network/abis'
import type { Split } from 'type-fest-4'

// sdk dependencies
import { ERC20_ABI } from '@/utils/constants'

import type {
  DecimalsTagReturnType,
  CacheTokenParams,
  TagProcessorDecimalsParams,
} from '@/types'

const cacheToken = (props: CacheTokenParams) => {
  const chainId = props.self.publicClient.chain.id
  const key = `${chainId}:${props.moduleAddress}:${props.tag}`
  const value = {
    address: props?.tokenAddress,
    decimals: props.decimals,
  }
  props.self.tokenCache.set(key, value)
}

export default async function decimals({
  argsOrRes,
  parameters,
  tagConfig,
  tag,
  publicClient,
  contract,
  self,
  tagOverwrites,
}: TagProcessorDecimalsParams): Promise<DecimalsTagReturnType> {
  const chainId = self?.publicClient.chain.id
  const { readContract } = publicClient

  let tokenAddress: `0x${string}` | undefined
  let decimals: number | undefined

  if (!tag) throw new Error('No decimals tag provided')

  const [, source, location, name] = tag?.split(':') as Split<Tag, ':'>
  const cachedToken = self?.tokenCache.get(
    `${chainId}:${contract?.address}:${tag}`
  )

  // INTERNAL CASE (NO SOURCE)
  // -------------------------------------------------------------------
  if (!source) {
    decimals = tagConfig?.decimals
    tokenAddress = tagConfig?.defaultToken
  }
  // SOURCE EXTRAS
  // -------------------------------------------------------------------
  else if (source === 'extras') {
    if (location === 'issuanceToken') {
      decimals = tagConfig?.issuanceTokenDecimals
      tokenAddress = tagConfig?.issuanceToken
    }
  }
  // OVERWRITE CASES
  else if (
    tagOverwrites?.issuanceTokenDecimals &&
    tag.includes('issuanceToken')
  ) {
    decimals = tagOverwrites.issuanceTokenDecimals
  } else if (!!cachedToken) {
    decimals = cachedToken.decimals
    tokenAddress = cachedToken.address
  } else {
    // SOURCE PARAMS
    // -------------------------------------------------------------------
    if (source === 'params') {
      // EXACT LOCATION
      if (location === 'exact') {
        decimals =
          // check if the value is contained by a non-tuple arg search it-
          // based on the index that is has in `inputs`
          argsOrRes[
            parameters.findIndex((parameter) => parameter.name === name)
          ] ||
          // or if there is a tuple arg that contains a parameter with-
          // `name`which would provide the decimals
          argsOrRes.find((item) => typeof item === 'object' && name in item)[
            name
          ]
      }

      // INDIRECT LOCATION
      if (location === 'indirect') {
        tokenAddress =
          argsOrRes[
            parameters.findIndex((parameter) => parameter.name === name)
          ]

        if (!tokenAddress) throw new Error('No token address found')

        decimals = <number>await readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'decimals',
        })
      }
    }

    // SOURCE CONTRACT
    // -------------------------------------------------------------------
    if (source === 'contract') {
      if (location === 'indirect') {
        tokenAddress = <`0x${string}` | undefined>await (() => {
          if (name === 'getIssuanceToken' && tagConfig?.issuanceToken)
            return tagConfig.issuanceToken
          return contract?.read?.[name]()
        })()

        if (!tokenAddress)
          throw new Error(`No token address found @ contract:indirect:${name}`)

        decimals = <number>await (() => {
          if (name === 'getIssuanceToken' && tagConfig?.issuanceTokenDecimals)
            return tagConfig.issuanceTokenDecimals
          return readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'decimals',
          })
        })()
      }

      if (location === 'exact') {
        tokenAddress = contract?.address

        if (!tokenAddress) throw new Error('No token address found')

        decimals = <number>await readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: name as any,
        })
      }
    }
  }

  if (!decimals) throw new Error('No decimals provided')

  if (!!self)
    cacheToken({
      self,
      tag,
      tokenAddress,
      moduleAddress: contract?.address,
      decimals,
    })

  const result = { decimals, tokenAddress }

  return result
}
