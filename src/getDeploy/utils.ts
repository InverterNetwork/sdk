import { getModuleData, ModuleName } from '@inverter-network/abis'
import { PublicClient, WalletClient, getContract } from 'viem'
import { METADATA_URL, ORCHESTRATOR_FACTORY_ADDRESS } from './constants'

// retrieves the deployment function via viem
export const getViemMethods = (
  walletClient: WalletClient,
  publicClient: PublicClient
) => {
  const { abi } = getModuleData('OrchestratorFactory_v1')
  const { write, simulate } = getContract({
    address: ORCHESTRATOR_FACTORY_ADDRESS,
    abi,
    client: {
      wallet: walletClient,
      public: publicClient,
    },
  })

  return {
    simulate: simulate.createOrchestrator,
    write: write.createOrchestrator,
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
