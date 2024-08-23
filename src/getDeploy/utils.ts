import {
  getModuleData,
  type GetModuleData,
  type GetModuleNameByType,
  type ModuleName,
} from '@inverter-network/abis'
import { getContract, parseUnits } from 'viem'
import { METADATA_URL, DEPLOYMENTS_URL } from './constants'
import { ERC20_ABI } from '../utils/constants'

import type { PublicClient, WalletClient } from 'viem'
import type {
  FactoryType,
  FilterByPrefix,
  GetUserArgs,
  PopWalletClient,
  UserModuleArg,
} from '..'
import type { Abi } from 'abitype'

type DeploymentResponse = {
  bancorFormula: Record<string, `0x${string}` | undefined>
  erc20Mock: Record<string, `0x${string}` | undefined>
  orchestratorFactory: Record<string, `0x${string}` | undefined>
  restrictedPimFactory: Record<string, `0x${string}` | undefined>
  immutablePimFactory: Record<string, `0x${string}` | undefined>
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

export const getAbi = <FT extends FactoryType>(factoryType: FT) => {
  const abi = getModuleData(
    (() => {
      switch (factoryType) {
        case 'default':
          return 'OrchestratorFactory_v1'
        case 'restricted-pim':
          return 'Restricted_PIM_Factory_v1'
        case 'immutable-pim':
          return 'Immutable_PIM_Factory_v1'
        default:
          throw new Error('Unsupported factory type')
      }
    })()
  ).abi as GetModuleData<
    FT extends 'restricted-pim'
      ? 'Restricted_PIM_Factory_v1'
      : FT extends 'immutable-pim'
        ? 'Immutable_PIM_Factory_v1'
        : 'OrchestratorFactory_v1'
  >['abi']

  return abi
}

export const getMethodName = <FT extends FactoryType>(factoryType: FT) => {
  const methodName = (() => {
    switch (factoryType) {
      case 'default':
        return 'createOrchestrator'
      case 'restricted-pim':
      case 'immutable-pim':
        return 'createPIMWorkflow'
      default:
        throw new Error('Unsupported factory type')
    }
  })() as FT extends 'restricted-pim' | 'immutable-pim'
    ? 'createPIMWorkflow'
    : 'createOrchestrator'

  return methodName
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
          case 'immutable-pim':
            return 'immutablePimFactory'
          default:
            throw new Error('Unsupported factory type')
        }
      })()
    ]?.[chainId]

  if (!address)
    throw new Error('Chain ID is not supported @ deployment factory address')

  const methodName = getMethodName(factoryType)

  const { write, simulate, estimateGas } = getContract({
    address,
    abi: abi as Abi,
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
    await publicClient.waitForTransactionReceipt({ hash })
  }

  // check if the userArgs are for a PIM factory
  if (!isPimArgs(userArgs, factoryType)) return
  // handle the PIM factory approve
  switch (factoryType) {
    case 'restricted-pim':
      await handle(
        userArgs.fundingManager.bondingCurveParams.initialCollateralSupply
      )
      break
    case 'immutable-pim':
      await handle(userArgs.initialPurchaseAmount)
      break
  }

  return
}
