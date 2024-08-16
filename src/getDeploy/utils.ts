import {
  getModuleData,
  type GetModuleData,
  type ModuleName,
} from '@inverter-network/abis'
import { decodeErrorResult, getContract } from 'viem'
import { METADATA_URL, DEPLOYMENTS_URL } from './constants'
import { ERC20_ABI } from '../utils/constants'

import type { PublicClient, WalletClient } from 'viem'
import type { FactoryType, RequestedModules, UserModuleArg } from '..'
import type { Abi } from 'abitype'

type DeploymentResponse = {
  bancorFormula: Record<string, `0x${string}` | undefined>
  erc20Mock: Record<string, `0x${string}` | undefined>
  orchestratorFactory: Record<string, `0x${string}` | undefined>
  restrictedPimFactory: Record<string, `0x${string}` | undefined>
}

export type GetViemMethodsParams<FT extends FactoryType> = {
  walletClient: WalletClient
  publicClient: PublicClient
  factoryType: FT
  abi: Abi
}

export type DeploymentVersion = 'v1.0.0'

export const fetchDeployment = async (
  version: DeploymentVersion
): Promise<DeploymentResponse> => {
  const response = await fetch(`${DEPLOYMENTS_URL}/${version}.json`)
  return await response.json()
}

// retrieves the deployment function via viem
export const getViemMethods = async ({
  walletClient,
  publicClient,
  factoryType,
  abi,
  version,
}: {
  walletClient: WalletClient
  publicClient: PublicClient
  factoryType: FactoryType
  abi: Abi
  version: DeploymentVersion
}) => {
  const deployment = await fetchDeployment(version)
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

export const getVersions = (name: ModuleName) => {
  const nameParts = name.split('_'),
    majorString = nameParts[nameParts.length - 1].slice(1),
    major = Number(majorString) > 1 ? 1 : Number(majorString),
    majorBigint = BigInt(major),
    minorBigint = BigInt(0), // TODO: find a way to get the latest minor version
    pathcBigint = BigInt(0) // TODO: find a way to get the latest patch version
  return {
    majorVersion: majorBigint,
    minorVersion: minorBigint,
    patchVersion: pathcBigint,
  }
}

// returns the MetaData struct that the deploy function requires for each module
export const assembleMetadata = <N extends ModuleName>(name: N) => {
  const versions = getVersions(name)
  const assembled = {
    title: name,
    url: METADATA_URL,
    ...versions,
  }
  return assembled
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

export const getAbi = <FT extends FactoryType>(factoryType: FT) => {
  const abi = getModuleData(
    (() => {
      switch (factoryType) {
        case 'default':
          return 'OrchestratorFactory_v1'
        case 'restricted-pim':
          return 'Restricted_PIM_Factory_v1'
        default:
          throw new Error('Unsupported factory type')
      }
    })()
  ).abi as GetModuleData<
    FT extends 'restricted-pim'
      ? 'Restricted_PIM_Factory_v1'
      : 'OrchestratorFactory_v1'
  >['abi']

  return abi
}

export const handleError = (requestedModules: RequestedModules, error: any) => {
  if (!error?.message?.includes?.('Unable to decode signature')) return error
  const signature = error.cause.signature as `0x${string}`

  let errorName: string | undefined

  const abis = [
    getModuleData('OrchestratorFactory_v1').abi,
    ...Object.values(requestedModules)
      .flat()
      .map((i) => getModuleData(i).abi),
  ]

  abis.forEach((abi) => {
    try {
      const value = decodeErrorResult({
        abi,
        data: signature,
      })
      if (value.errorName) errorName = value.errorName
    } catch {
      // do nothing
    }
  })

  if (!errorName) return error

  return new Error(errorName)
}
