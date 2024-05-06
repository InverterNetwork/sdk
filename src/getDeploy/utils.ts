import {
  GetModuleVersion,
  getModuleData,
  ModuleName,
} from '@inverter-network/abis'
import { WalletClient, getContract } from 'viem'
import { METADATA_URL, ORCHESTRATOR_FACTORY_ADDRESS } from './constants'

// retrieves the deployment function via viem
export const getWriteFn = (walletClient: WalletClient) => {
  const { abi } = getModuleData('OrchestratorFactory', '1')
  const orchestratorFactory = getContract({
    address: ORCHESTRATOR_FACTORY_ADDRESS,
    abi,
    client: {
      wallet: walletClient,
    },
  })

  return orchestratorFactory.write.createOrchestrator
}

export const getMajorMinorVersion = (majorVersion: `${number}`) => {
  const majorBigint = BigInt(majorVersion),
    minorBigint = BigInt(0) // TODO: find a way to get the latest minor version
  return { majorVersion: majorBigint, minorVersion: minorBigint }
}

// returns the MetaData struct that the deploy function requires for each module
export const assembleMetadata = <N extends ModuleName>(
  name: N,
  version: GetModuleVersion<N>
) => {
  const majorMinorVersion = getMajorMinorVersion(version)
  return {
    title: name,
    url: METADATA_URL,
    ...majorMinorVersion,
  }
}
