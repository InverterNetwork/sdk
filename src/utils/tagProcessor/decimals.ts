import { PublicClient } from 'viem'
import { ERC20_ABI } from '../constants'
import { Extras, FormattedAbiParameter } from '../../types'
import { Tag } from '@inverter-network/abis'
import { Inverter } from '../../Inverter'
import { DecimalsTagReturn } from '../../types/tag'
import { Split } from 'type-fest-4'

type CacheTokenProps = {
  self: Inverter
  tag: Tag
  tokenAddress?: `0x${string}`
  moduleAddress: `0x${string}`
  decimals: number
}

const cacheToken = (props: CacheTokenProps) => {
  const key = `${props.moduleAddress}:${props.tag}`
  const value = {
    address: props?.tokenAddress,
    decimals,
  }
  props.self.tokenCache.set(key, value)
}

export default async function decimals({
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
  let tokenAddress: `0x${string}` | undefined
  let decimals: number | undefined
  const { readContract } = publicClient

  if (!tag) throw new Error('No decimals tag provided')

  console.log('tag', tag)

  const [, source, location, name] = tag?.split(':') as Split<Tag, ':'>
  const cachedToken = self?.tokenCache.get(`${contract?.address}:${tag}`)

  // INTERNAL CASE (NO SOURCE)
  if (!source) {
    decimals = extras?.decimals
    tokenAddress = extras?.defaultToken
  } else if (!!cachedToken) {
    decimals = cachedToken.decimals
    tokenAddress = cachedToken.address
  } else {
    // SOURCE PARAMS
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
    if (source === 'contract') {
      if (location === 'indirect') {
        tokenAddress = <`0x${string}` | undefined>await contract?.read?.[name]()

        if (!tokenAddress)
          throw new Error('No token address found @ contract:indirect:name')

        console.log('DECIMALS TAG TOKEN ADDRESS:', tokenAddress)

        decimals = <number>await readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'decimals',
        })

        console.log('DECIMALS TAG DECIMALS:', decimals)
      }

      if (location === 'exact') {
        tokenAddress = contract?.address

        if (!tokenAddress) throw new Error('No token address found')

        decimals = <number>await readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: name,
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
