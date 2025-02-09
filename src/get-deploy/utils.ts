import type { GetModuleNameByType, ModuleName } from '@inverter-network/abis'
import { getContract, parseUnits } from 'viem'
import { METADATA_URL, DEPLOYMENTS_URL } from './constants'
import { ERC20_ABI } from '../utils/constants'

import type { PublicClient, WalletClient } from 'viem'
import type {
  Extras,
  FactoryType,
  FilterByPrefix,
  GetUserArgs,
  PopWalletClient,
  UserModuleArg,
} from '..'
import type { Abi } from 'abitype'
import { anvil } from 'viem/chains'

export type DeploymentResponse = {
  bancorFormula: Record<string, `0x${string}` | undefined>
  erc20Mock: Record<string, `0x${string}` | undefined>
  orchestratorFactory: Record<string, `0x${string}` | undefined>
  restrictedPimFactory: Record<string, `0x${string}` | undefined>
  immutablePimFactory: Record<string, `0x${string}` | undefined>
}

export type DeploymentVersion = 'v1.0.0'

export const fetchDeployment = async (
  version: DeploymentVersion
): Promise<DeploymentResponse> => {
  const response = await fetch(`${DEPLOYMENTS_URL}/${version}.json`)
  return await response.json()
}

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
    case 'default':
      if (chainId === anvil.id)
        return process.env.TEST_ORCHESTRATOR_FACTORY_ADDRESS as `0x${string}`

      return deployment.orchestratorFactory?.[chainId]
    default:
      throw new Error('Invalid factory type')
  }
}

// retrieves the deployment function via viem
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
): Promise<Extras> => {
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

const isPimArgs = (
  args: any,
  factoryType: FactoryType
): args is GetUserArgs<
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
      return !!args?.initialPurchaseAmount
    default:
      return false
  }
}

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
      return await handle(userArgs.initialPurchaseAmount)
  }

  return
}
