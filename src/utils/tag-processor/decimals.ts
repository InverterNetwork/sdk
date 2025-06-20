// external dependencies
import type { Tag } from '@inverter-network/abis'
import type {
  CacheTokenParams,
  DecimalsTagReturnType,
  TagConfig,
  TagProcessorDecimalsParams,
} from '@/types'
import d from 'debug'
import type { Split } from 'type-fest-4'

// sdk dependencies
import { ERC20_ABI } from '@/utils/constants'

const debug = d('inverter:tag-processor:decimals')

/**
 * @description Cache token information for faster subsequent lookups
 * @param props - Caching parameters including token address, decimals, and cache key info
 */
const cacheTokenInfo = (props: CacheTokenParams) => {
  const chainId = props.self.publicClient.chain.id
  const cacheKey = `${chainId}:${props.moduleAddress}:${props.tag}`
  const tokenInfo = {
    address: props?.tokenAddress,
    decimals: props.decimals,
  }
  props.self.tokenCache.set(cacheKey, tokenInfo)
}

/**
 * @description Try to get cached token information
 * @param chainId - The blockchain chain ID
 * @param contractAddress - The contract address
 * @param tag - The decimals tag
 * @param tokenCache - The token cache instance
 * @returns Cached token info or undefined
 */
const getCachedTokenInfo = (
  chainId: number,
  contractAddress: `0x${string}` | undefined,
  tag: string,
  tokenCache: Map<string, any>
) => {
  const cacheKey = `${chainId}:${contractAddress}:${tag}`
  return tokenCache.get(cacheKey)
}

/**
 * @description Handle decimals when no source is specified (internal case)
 * @param tagConfig - Configuration containing default decimals and token
 * @returns Token decimals and address
 */
const handleInternalCase = (tagConfig?: TagConfig) => {
  debug('NO_SOURCE - Using internal configuration')
  return {
    decimals: tagConfig?.decimals,
    tokenAddress: tagConfig?.defaultToken,
  }
}

/**
 * @description Handle decimals from extras source
 * @param location - The location within extras (e.g., 'issuanceToken')
 * @param tagConfig - Configuration containing extra token info
 * @returns Token decimals and address
 */
const handleExtrasSource = (location: string, tagConfig?: TagConfig) => {
  if (location === 'issuanceToken') {
    debug('EXTRAS:ISSUANCE_TOKEN - Using issuance token from extras')
    return {
      decimals: tagConfig?.issuanceTokenDecimals,
      tokenAddress: tagConfig?.issuanceToken,
    }
  }

  debug('EXTRAS - General extras case')
  return { decimals: undefined, tokenAddress: undefined }
}

/**
 * @description Handle overwrite cases for specific tag patterns
 * @param tag - The complete tag string
 * @param tagConfig - Configuration that may contain overrides
 * @returns Token decimals and address, or undefined if no overwrite applies
 */
const handleOverwriteCases = (tag: string, tagConfig?: TagConfig) => {
  // Direct decimals overwrite
  if (tag === 'decimals' && tagConfig?.decimals) {
    debug('OVERWRITE:DECIMALS - Using direct decimals override')
    return {
      decimals: tagConfig.decimals,
      tokenAddress: undefined,
    }
  }

  // Issuance token decimals overwrite (without approval)
  const isIssuanceTokenTag = ['issuanceToken', 'getIssuanceToken'].some((t) =>
    tag.includes(t)
  )
  const isNotApprovalTag = !tag.includes('approval')

  if (
    isIssuanceTokenTag &&
    isNotApprovalTag &&
    tagConfig?.issuanceTokenDecimals
  ) {
    debug(
      'OVERWRITE:ISSUANCE_TOKEN_DECIMALS - Using issuance token decimals override'
    )

    // If both decimals and token address are available
    if (tagConfig?.issuanceToken) {
      debug(
        'OVERWRITE:ISSUANCE_TOKEN_DECIMALS_AND_ISSUANCE_TOKEN - Using both decimals and token'
      )
      return {
        decimals: tagConfig.issuanceTokenDecimals,
        tokenAddress: tagConfig.issuanceToken,
      }
    }

    return {
      decimals: tagConfig.issuanceTokenDecimals,
      tokenAddress: undefined,
    }
  }

  return undefined
}

/**
 * @description Handle decimals from params source with exact location
 * @param name - Parameter name to look for
 * @param argsOrRes - Function arguments or results array
 * @param parameters - Parameter definitions
 * @returns Decimals value
 */
const handleParamsExact = (
  name: string,
  argsOrRes: any[],
  parameters: readonly any[]
) => {
  debug('SOURCE_PARAMS:EXACT - Looking for exact parameter value')

  // Check if the value is in a non-tuple arg based on parameter index
  const paramIndex = parameters.findIndex(
    (parameter) => parameter.name === name
  )
  if (paramIndex !== -1 && argsOrRes[paramIndex] !== undefined) {
    return argsOrRes[paramIndex]
  }

  // Check if there's a tuple arg containing the named parameter
  const tupleArg = argsOrRes.find(
    (item) => typeof item === 'object' && item !== null && name in item
  )
  if (tupleArg) {
    return tupleArg[name]
  }

  return undefined
}

/**
 * @description Handle decimals from params source with indirect location
 * @param name - Parameter name containing token address
 * @param argsOrRes - Function arguments or results array
 * @param parameters - Parameter definitions
 * @param readContract - Function to read from contract
 * @returns Token decimals and address
 */
const handleParamsIndirect = async (
  name: string,
  argsOrRes: any[],
  parameters: readonly any[],
  readContract: any
) => {
  debug(
    'SOURCE_PARAMS:INDIRECT - Getting token address from params, then reading decimals'
  )

  const paramIndex = parameters.findIndex(
    (parameter) => parameter.name === name
  )
  const tokenAddress = argsOrRes[paramIndex]

  if (!tokenAddress) {
    throw new Error(`No token address found in parameter: ${name}`)
  }

  const decimals = await readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
  })

  return { decimals: Number(decimals), tokenAddress }
}

/**
 * @description Handle decimals from contract source
 * @param location - Location type ('exact' or 'indirect')
 * @param name - Function or property name
 * @param contract - Contract instance
 * @param readContract - Function to read from contract
 * @returns Token decimals and address
 */
const handleContractSource = async (
  location: string,
  name: string,
  contract: any,
  readContract: any
) => {
  if (location === 'indirect') {
    debug(
      'SOURCE_CONTRACT:INDIRECT - Getting token address from contract, then reading decimals'
    )

    const tokenAddress = await contract?.read?.[name]()
    if (!tokenAddress) {
      throw new Error(`No token address found at contract.${name}()`)
    }

    const decimals = await readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })

    return { decimals: Number(decimals), tokenAddress }
  }

  if (location === 'exact') {
    debug('SOURCE_CONTRACT:EXACT - Reading decimals directly from contract')

    const tokenAddress = contract?.address
    if (!tokenAddress) {
      throw new Error('No contract address available')
    }

    const decimals = await readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: name,
    })

    return { decimals: Number(decimals), tokenAddress }
  }

  throw new Error(`Unsupported contract location: ${location}`)
}

/**
 * @description Main decimals tag processor function
 * @param params - All parameters needed for processing decimals tags
 * @returns Object containing decimals and optional token address
 */
export default async function decimals({
  argsOrRes,
  parameters,
  tagConfig,
  tag,
  publicClient,
  contract,
  self,
}: TagProcessorDecimalsParams): Promise<DecimalsTagReturnType> {
  if (!tag) {
    throw new Error('No decimals tag provided')
  }

  debug('Processing decimals tag:', tag)

  const chainId = self?.publicClient.chain.id ?? publicClient.chain?.id
  if (!chainId) throw new Error('No chain ID found')
  const { readContract } = publicClient

  // Parse the tag components
  const [, source, location, name] = tag.split(':') as Split<Tag, ':'>

  // Try to get cached token info first
  const cachedToken = self?.tokenCache
    ? getCachedTokenInfo(chainId, contract?.address, tag, self.tokenCache)
    : undefined

  if (cachedToken) {
    debug('Using cached token information')
    return {
      decimals: cachedToken.decimals,
      tokenAddress: cachedToken.address,
    }
  }

  let result: { decimals?: number; tokenAddress?: `0x${string}` } = {}

  // Handle different sources
  if (!source) {
    // Internal case - no external source specified
    result = handleInternalCase(tagConfig)
  } else if (source === 'extras') {
    // Extras source - predefined extra tokens
    result = handleExtrasSource(location, tagConfig)
  } else {
    // Check for overwrite cases first
    const overwriteResult = handleOverwriteCases(tag, tagConfig)
    if (overwriteResult) {
      result = overwriteResult
    } else if (source === 'params') {
      // Params source - get from function parameters
      if (location === 'exact') {
        const decimals = handleParamsExact(name, argsOrRes, parameters)
        result = { decimals, tokenAddress: undefined }
      } else if (location === 'indirect') {
        result = await handleParamsIndirect(
          name,
          argsOrRes,
          parameters,
          readContract
        )
      }
    } else if (source === 'contract') {
      // Contract source - read from contract
      result = await handleContractSource(
        location,
        name,
        contract,
        readContract
      )
    }
  }

  // Validate that we got decimals
  if (result.decimals === undefined) {
    throw new Error(`Unable to determine decimals for tag: ${tag}`)
  }

  // Cache the result for future use
  if (self?.tokenCache) {
    cacheTokenInfo({
      self,
      tag,
      tokenAddress: result.tokenAddress,
      moduleAddress: contract?.address,
      decimals: result.decimals!, // We've already validated this is not undefined above
    })
  }

  return {
    decimals: result.decimals,
    tokenAddress: result.tokenAddress,
  }
}
