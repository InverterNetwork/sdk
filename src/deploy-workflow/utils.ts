// external dependencies
import { getModuleData } from '@inverter-network/abis'
import type { ModuleName } from '@inverter-network/abis'
// sdk types
import type {
  DeploymentVersion,
  FetchDeploymentReturnType,
  ModuleData,
  TagConfig,
  UserModuleArg,
} from '@/types'
// sdk utils
import { ERC20_ABI } from '@/utils'
import type { PublicClient, WalletClient } from 'viem'
import { getContract } from 'viem'
import { anvil } from 'viem/chains'

// get-deploy constants
import { DEPLOYMENTS_URL, METADATA_URL } from './constants'

/**
 * @description Fetches the deployment for a given version
 * @param version - The version of the deployment
 * @returns The deployment for the given version
 */
export const fetchDeployment = async (
  version: DeploymentVersion
): Promise<FetchDeploymentReturnType> => {
  const response = await fetch(`${DEPLOYMENTS_URL}/${version}.json`)
  return await response.json()
}

/**
 * @description Gets the factory address for a given factory type
 * @param version - The version of the deployment
 * @param factoryType - The type of factory
 * @param chainId - The chain ID
 * @returns The factory address for the given factory type
 */
export const getFactoryAddress = async ({
  version,
  chainId,
}: {
  version: DeploymentVersion
  chainId?: number
}) => {
  if (!chainId) throw new Error('Chain ID not found')

  if (chainId === anvil.id)
    return process.env.TEST_ORCHESTRATOR_FACTORY_ADDRESS as `0x${string}`

  const deployment = await fetchDeployment(version)

  const factoryAddress = deployment.orchestratorFactory?.[chainId]

  if (!factoryAddress)
    throw new Error('Factory address not found @ deployment factory address')

  return factoryAddress
}

/**
 * @description Retrieves the viem methods for deployment
 * @param walletClient - The wallet client
 * @param publicClient - The public client
 * @param version - The version of the deployment
 * @param abi - The ABI of the factory
 * @returns The viem methods for the given factory type
 */
export const getViemMethods = async ({
  walletClient,
  publicClient,
  version,
}: {
  walletClient: WalletClient
  publicClient: PublicClient
  version: DeploymentVersion
}) => {
  const abi = getModuleData('OrchestratorFactory_v1').abi
  const chainId = publicClient.chain?.id

  const address = await getFactoryAddress({
    version,

    chainId,
  })

  const { write, simulate, estimateGas } = getContract({
    address,
    abi,
    client: {
      wallet: walletClient,
      public: publicClient,
    },
  })

  return {
    abi,
    factoryAddress: address,
    simulateWrite: simulate.createOrchestrator,
    write: write.createOrchestrator,
    estimateGas: estimateGas.createOrchestrator,
  }
}

/**
 * @description Gets the versions for a given module name
 * @param name - The name of the module
 * @returns The versions for the given module name
 */
export const getVersions = (name: ModuleName | ModuleData['name']) => {
  const nameParts = name.split('_'),
    majorString = nameParts[nameParts.length - 1].slice(1),
    major = Number(majorString) > 1 ? Number(majorString) : 1,
    majorBigint = BigInt(major),
    minorBigint = BigInt(0), // TODO: find a way to get the latest minor version
    patchBigint = BigInt(0) // TODO: find a way to get the latest patch version

  return {
    majorVersion: majorBigint,
    minorVersion: minorBigint,
    patchVersion: patchBigint,
  }
}

/**
 * @description Assembles the metadata for a given module name
 * @param name - The name of the module
 * @returns The metadata for the given module name
 */
export const assembleMetadata = (requestedModule: ModuleName | ModuleData) => {
  const name =
    typeof requestedModule === 'object' ? requestedModule.name : requestedModule

  const versions = getVersions(name)
  const assembled = {
    title: name,
    url: METADATA_URL,
    ...versions,
  }
  return assembled
}

/**
 * @description Gets the default token for a given funding manager
 * @param publicClient - The public client
 * @param fundingManager - The funding manager
 * @returns The default token for the given funding manager
 */
export const getDefaultToken = async (
  publicClient: PublicClient,
  fundingManager: UserModuleArg
): Promise<Pick<TagConfig, 'defaultToken' | 'decimals'>> => {
  try {
    const { readContract } = publicClient

    const tokenAddress = (fundingManager['collateralToken'] ??
      fundingManager['orchestratorTokenAddress']) as `0x${string}`

    const decimals = <number>await readContract({
      address: tokenAddress!,
      functionName: 'decimals',
      abi: ERC20_ABI,
    })
    return { defaultToken: tokenAddress!, decimals }
  } catch {
    return { defaultToken: '0x' as `0x${string}`, decimals: 18 }
  }
}
