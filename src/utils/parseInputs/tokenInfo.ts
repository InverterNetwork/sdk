import {
  PublicClient,
  ReadContractParameters,
  WalletClient,
  parseUnits,
} from 'viem'
import { TOKEN_DATA_ABI } from '../constants'
import { Extras, FormattedAbiParameter } from '../../types'
import { Tag } from '@inverter-network/abis'
import { InverterSDK } from '../../InverterSDK'

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

const getRequiredAllowance = async (
  transferAmount: bigint,
  tokenAddress: `0x${string}`,
  spenderAddress: `0x${string}`,
  publicClient: PublicClient,
  walletClient?: WalletClient
) => {
  const userAddress = walletClient?.account?.address
  if (tokenAddress && userAddress) {
    const currentAllowance = <bigint>await publicClient.readContract({
      address: tokenAddress,
      abi: TOKEN_DATA_ABI,
      functionName: 'allowance',
      args: [userAddress, spenderAddress],
    })
    const requiredAllowance = transferAmount - currentAllowance
    return {
      amount: requiredAllowance,
      spender: spenderAddress,
      owner: userAddress,
      token: tokenAddress,
    }
  }

  return undefined
}

export default async function ({
  arg,
  args,
  inputs,
  extras,
  decimalsTag,
  approvalTag,
  publicClient,
  walletClient,
  contract,
  self,
}: {
  arg: any
  args: any[]
  inputs: readonly FormattedAbiParameter[]
  extras?: Extras
  decimalsTag: Tag
  approvalTag?: Tag | undefined
  publicClient: PublicClient
  walletClient?: WalletClient
  contract?: any
  self?: InverterSDK
}) {
  let tokenAddress
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

  const inputWithDecimals = parseUnits(arg, decimals)

  let requiredAllowance

  if (approvalTag) {
    requiredAllowance = await getRequiredAllowance(
      inputWithDecimals,
      tokenAddress,
      contract.address,
      publicClient,
      walletClient
    )
  }

  return {
    inputWithDecimals,
    requiredAllowance,
  }
}
