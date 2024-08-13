import { type ModuleName } from '@inverter-network/abis'
import { getContract } from 'viem'
import { METADATA_URL, DEPLOYMENTS_URL } from './constants'
import { ERC20_ABI } from '../utils/constants'

import type { PublicClient, WalletClient } from 'viem'
import type { FactoryType, UserModuleArg } from '..'
import type { Abi } from 'abitype'

type DeploymentResponse = {
  orchestratorFactory: Record<string, `0x${string}` | undefined>
  restrictedPimFactory: Record<string, `0x${string}` | undefined>
}

export type GetViemMethodsParams<FT extends FactoryType> = {
  walletClient: WalletClient
  publicClient: PublicClient
  factoryType: FT
  abi: Abi
}

// retrieves the deployment function via viem
export const getViemMethods = async <FT extends FactoryType>({
  walletClient,
  publicClient,
  factoryType,
  abi,
}: {
  walletClient: WalletClient
  publicClient: PublicClient
  factoryType: FT
  abi: Abi
}) => {
  const response = await fetch(DEPLOYMENTS_URL)
  const deployment = <DeploymentResponse>await response.json()
  const chainId = publicClient.chain?.id

  if (!chainId) throw new Error('Chain ID not found')

  const address =
    deployment[
      (() => {
        switch (factoryType) {
          case 'default':
            return 'orchestratorFactory'
          case 'restricted-pim':
            return 'restrictedPimFactory'
          default:
            throw new Error('Unsupported factory type')
        }
      })()
    ]?.[chainId]

  if (!address)
    throw new Error('Chain ID is not supported @ deployment factory address')

  const { write, simulate, estimateGas } = getContract({
    address,
    abi,
    client: {
      wallet: walletClient,
      public: publicClient,
    },
  })

  return {
    simulateWrite: simulate.createOrchestrator,
    write: write.createOrchestrator,
    estimateGas: estimateGas.createOrchestrator,
  }
}

export const getMajorMinorVersion = (name: ModuleName) => {
  const nameParts = name.split('_'),
    majorString = nameParts[nameParts.length - 1].slice(1),
    major = Number(majorString) > 1 ? 1 : Number(majorString),
    majorBigint = BigInt(major),
    minorBigint = BigInt(0) // TODO: find a way to get the latest minor version
  return { majorVersion: majorBigint, minorVersion: minorBigint }
}

// returns the MetaData struct that the deploy function requires for each module
export const assembleMetadata = <N extends ModuleName>(name: N) => {
  const majorMinorVersion = getMajorMinorVersion(name)
  return {
    title: name,
    url: METADATA_URL,
    ...majorMinorVersion,
  }
}

export const getDefaultToken = async (
  publicClient: PublicClient,
  fundingManager: UserModuleArg
) => {
  const { readContract } = publicClient

  const tokenAddress = (fundingManager['collateralToken'] ??
    fundingManager['orchestratorTokenAddress']) as `0x${string}`

  const decimals = <number>await readContract({
    address: tokenAddress!,
    functionName: 'decimals',
    abi: ERC20_ABI,
  })
  return { defaultToken: tokenAddress!, decimals }
}
