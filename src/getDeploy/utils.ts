import {
  ModuleVersionKey,
  data,
  getModuleVersion,
} from '@inverter-network/abis'
import { GenericModuleName } from './types'
import { WalletClient, getContract } from 'viem'
import { METADATA_URL, ORCHESTRATOR_FACTORY_ADDRESS } from './constants'

// retrieves the deployment arguments from the module version
export const getDeploymentConfig = <
  TGenericModuleName extends GenericModuleName,
  TModuleVersionKey extends ModuleVersionKey,
>(
  name: TGenericModuleName,
  version: TModuleVersionKey
) => {
  const { moduleType, deploymentArgs } = data[name][version]
  return { deploymentArgs, moduleType }
}

// retrieves the deployment function via viem
export const getWriteFn = (walletClient: WalletClient) => {
  const { abi } = getModuleVersion('OrchestratorFactory', 'v1.0')
  const orchestratorFactory = getContract({
    address: ORCHESTRATOR_FACTORY_ADDRESS,
    abi,
    client: {
      wallet: walletClient,
    },
  })

  return orchestratorFactory.write.createOrchestrator
}

// extracts the major and minor version from the version string
export const extractMajorMinorVersion = (versionString: ModuleVersionKey) => {
  const version = versionString
    .substring(1)
    .split('.')
    .map((v) => parseInt(v))
  return { majorVersion: BigInt(version[0]), minorVersion: BigInt(version[1]) }
}

// returns the MetaData struct that the deploy function requires for each module
export const assembleMetadata = <ModuleName extends GenericModuleName>(
  name: ModuleName,
  version: ModuleVersionKey
) => {
  const majorMinorVersion = extractMajorMinorVersion(version)
  return {
    title: name,
    url: METADATA_URL,
    ...majorMinorVersion,
  }
}
