// external dependencies
import type { Tag } from '@inverter-network/abis'
import type {
  CacheTokenParams,
  DecimalsTagReturnType,
  TagProcessorDecimalsParams,
} from '@/types'
import d from 'debug'
import type { Split } from 'type-fest-4'

// sdk dependencies
import { ERC20_ABI } from '@/utils/constants'

const debug = d('inverter:tag-processor:decimals')

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
}: TagProcessorDecimalsParams): Promise<DecimalsTagReturnType> {
  const chainId = self?.publicClient.chain.id
  const { readContract } = publicClient

  let tokenAddress: `0x${string}` | undefined
  let decimals: number | undefined

  if (!tag) throw new Error('No decimals tag provided')

  debug('TAG:', tag)

  const [, source, location, name] = tag?.split(':') as Split<Tag, ':'>
  const cachedToken = self?.tokenCache.get(
    `${chainId}:${contract?.address}:${tag}`
  )

  if (!!cachedToken) {
    decimals = cachedToken.decimals
    tokenAddress = cachedToken.address
  }
  // INTERNAL CASE (NO SOURCE)
  // -------------------------------------------------------------------
  else if (!source) {
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
  else if (tag === 'decimals' && tagConfig?.decimals) {
    decimals = tagConfig.decimals
  } else if (
    ['issuanceToken', 'getIssuanceToken'].some((t) => tag.includes(t)) &&
    !tag.includes('approval') &&
    tagConfig?.issuanceTokenDecimals
  ) {
    decimals = tagConfig.issuanceTokenDecimals
  } else if (
    ['issuanceToken', 'getIssuanceToken'].some((t) => tag.includes(t)) &&
    tagConfig?.issuanceToken &&
    tagConfig?.issuanceTokenDecimals
  ) {
    decimals = tagConfig.issuanceTokenDecimals
    tokenAddress = tagConfig.issuanceToken
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
        tokenAddress = contract?.read?.[name]()

        if (!tokenAddress)
          throw new Error(`No token address found @ contract:indirect:${name}`)

        decimals = <number>await readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'decimals',
        })
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
