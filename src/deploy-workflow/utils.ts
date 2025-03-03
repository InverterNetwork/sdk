// external dependencies
import type { GetModuleNameByType, ModuleName } from '@inverter-network/abis'
import type { PublicClient, WalletClient } from 'viem'
import { getContract, parseUnits } from 'viem'
import type { Abi } from 'abitype'
import { anvil } from 'viem/chains'

// sdk types
import type {
  DeploymentVersion,
  TagConfig,
  FactoryType,
  FetchDeploymentReturnType,
  FilterByPrefix,
  GetDeployWorkflowArgs,
  PopWalletClient,
  UserModuleArg,
} from '@/types'

// get-deploy constants
import { METADATA_URL, DEPLOYMENTS_URL } from './constants'

// sdk utils
import { ERC20_ABI } from '@/utils'

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
  factoryType,
  chainId,
}: {
  version: DeploymentVersion
  factoryType: FactoryType
  chainId?: number
}) => {
  if (!chainId) throw new Error('Chain ID not found')

  const deployment = await fetchDeployment(version)

  switch (factoryType) {
    case 'restricted-pim':
      if (chainId === anvil.id)
        return process.env.TEST_RESTRICTED_PIM_FACTORY_ADDRESS as `0x${string}`

      return deployment.restrictedPimFactory?.[chainId]

    case 'immutable-pim':
      if (chainId === anvil.id)
        return process.env.TEST_IMMUTABLE_PIM_FACTORY_ADDRESS as `0x${string}`

      return deployment.immutablePimFactory?.[chainId]

    case 'migrating-pim':
      if (chainId === anvil.id)
        return process.env.TEST_MIGRATING_PIM_FACTORY_ADDRESS as `0x${string}`

      return deployment.migratingPimFactory?.[chainId]
    case 'default':
      if (chainId === anvil.id)
        return process.env.TEST_ORCHESTRATOR_FACTORY_ADDRESS as `0x${string}`

      return deployment.orchestratorFactory?.[chainId]
    default:
      throw new Error('Invalid factory type')
  }
}

/**
 * @description Retrieves the viem methods for deployment
 * @param walletClient - The wallet client
 * @param publicClient - The public client
 * @param factoryType - The type of factory
 * @param version - The version of the deployment
 * @param abi - The ABI of the factory
 * @returns The viem methods for the given factory type
 */
export const getViemMethods = async ({
  walletClient,
  publicClient,
  factoryType,
  version,
  abi,
}: {
  abi: Abi
  walletClient: WalletClient
  publicClient: PublicClient
  factoryType: FactoryType
  version: DeploymentVersion
}) => {
  const chainId = publicClient.chain?.id

  const address = await getFactoryAddress({
    version,
    factoryType,
    chainId,
  })

  if (!address)
    throw new Error('Chain ID is not supported @ deployment factory address')

  const methodName = {
    'restricted-pim': 'createPIMWorkflow' as const,
    'immutable-pim': 'createPIMWorkflow' as const,
    'migrating-pim': 'createPIMWorkflow' as const,
    default: 'createOrchestrator' as const,
  }[factoryType]

  const { write, simulate, estimateGas } = getContract({
    address,
    abi,
    client: {
      wallet: walletClient,
      public: publicClient,
    },
  })

  return {
    factoryAddress: address,
    simulateWrite: simulate[methodName],
    write: write[methodName],
    estimateGas: estimateGas[methodName],
  }
}

/**
 * @description Gets the versions for a given module name
 * @param name - The name of the module
 * @returns The versions for the given module name
 */
export const getVersions = (name: ModuleName) => {
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
export const assembleMetadata = <N extends ModuleName>(name: N) => {
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
): Promise<TagConfig> => {
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

/**
 * @description Checks if the user args are for a PIM factory
 * @param args - The user args
 * @param factoryType - The type of factory
 * @returns True if the user args are for a PIM factory, false otherwise
 */
const isPimArgs = (
  args: any,
  factoryType: FactoryType
): args is GetDeployWorkflowArgs<
  {
    fundingManager: FilterByPrefix<
      GetModuleNameByType<'fundingManager'>,
      'FM_BC'
    >
    paymentProcessor: GetModuleNameByType<'paymentProcessor'>
    authorizer: GetModuleNameByType<'authorizer'>
  },
  'restricted-pim' | 'immutable-pim'
> => {
  switch (factoryType) {
    case 'restricted-pim':
      return !!args?.fundingManager?.bondingCurveParams?.initialCollateralSupply
    case 'immutable-pim':
    case 'migrating-pim':
      return !!args?.initialPurchaseAmount
    default:
      return false
  }
}

/**
 * @description Handles the PIM factory approve
 * @param factoryType - The type of factory
 * @param factoryAddress - The address of the factory
 * @param userArgs - The user args
 * @param walletClient - The wallet client
 * @param publicClient - The public client
 */
export const handlePimFactoryApprove = async ({
  factoryType,
  factoryAddress,
  userArgs,
  walletClient,
  publicClient,
}: {
  userArgs: any
  factoryType: FactoryType
  factoryAddress: `0x${string}`
  walletClient: PopWalletClient
  publicClient: PublicClient
}) => {
  const handle = async (requiredAllowance: string) => {
    // get the collateral token address
    const collateralTokenAddress = userArgs.fundingManager.collateralToken
    // get the ERC20 contract
    const contract = getContract({
      address: collateralTokenAddress,
      abi: ERC20_ABI,
      client: { wallet: walletClient, public: publicClient },
    })
    // get the decimals of the ERC20 token
    const decimals = await contract.read.decimals()
    // parse the required allowance
    const parsedRequiredAllowance = parseUnits(requiredAllowance, decimals)
    // get the current allowance
    const allowance = await contract.read.allowance([
      walletClient.account.address,
      factoryAddress,
    ])
    // check if the current allowance is enough
    const hasEnoughAllowance = allowance >= parsedRequiredAllowance
    // if the current allowance is enough, return
    if (hasEnoughAllowance) return
    // if the current allowance is not enough, approve the factory
    const hash = await contract.write.approve([
      factoryAddress,
      parsedRequiredAllowance,
    ])
    // wait for the transaction to be mined
    const transactionReceipt = await publicClient.waitForTransactionReceipt({
      hash,
    })

    return [transactionReceipt]
  }

  // check if the userArgs are for a PIM factory
  if (!isPimArgs(userArgs, factoryType)) return
  // handle the PIM factory approve
  switch (factoryType) {
    case 'immutable-pim':
    case 'migrating-pim':
      return await handle(userArgs.initialPurchaseAmount)
  }

  return
}
