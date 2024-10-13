import { processInputs } from '../'
import type {
  DeployableContracts,
  GetUserModuleArg,
  PopPublicClient,
  PopWalletClient,
} from '..'
import { getModuleData } from '@inverter-network/abis'

export default async function <T extends DeployableContracts>({
  name,
  walletClient,
  publicClient,
  args,
}: {
  name: T
  walletClient: PopWalletClient
  publicClient: PopPublicClient
  args: GetUserModuleArg<T>
}) {
  const moduleData = getModuleData<T>(name)

  if (!('deploymentInputs' in moduleData)) {
    throw new Error('Invalid module data')
  }

  const handledArgs = moduleData.deploymentInputs.configData.map(
    (input) => (args as any)?.[input.name]
  )

  const processedArgs = await processInputs({
    args: handledArgs,
    extendedInputs: moduleData.deploymentInputs.configData,
    publicClient,
    kind: 'write',
  })

  // Deploy the contract
  const transactionHash = await walletClient.deployContract({
    abi: moduleData.abi,
    bytecode: moduleData.deploymentInputs.bytecode,
    args: processedArgs.processedInputs as any,
  })

  // Wait for the transaction to be mined
  const { contractAddress } = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  })

  const result = {
    contractAddress,
    transactionHash,
  }

  return result
}
