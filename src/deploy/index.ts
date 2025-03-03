// external dependencies
import { getModuleData } from '@inverter-network/abis'

// sdk types
import type {
  DeployableContracts,
  GetUserModuleArg,
  MethodOptions,
  PopPublicClient,
  PopWalletClient,
} from '@/types'

// sdk utils
import { processInputs } from '@/utils'

export default async function <T extends DeployableContracts>(
  {
    name,
    walletClient,
    publicClient,
    args,
  }: {
    name: T
    walletClient: PopWalletClient
    publicClient: PopPublicClient
    args: GetUserModuleArg<T>
  },
  options?: MethodOptions
) {
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
    // if nonce is provided, use it
    ...(options?.nonce ? { nonce: options.nonce } : {}),
  })

  // If onHash is provided, call it
  if (options?.onHash) {
    options.onHash(transactionHash)
  }

  // Wait for the transaction to be mined
  const receipt = await publicClient.waitForTransactionReceipt({
    // if confirmations is provided and not 0, use it else default to 1
    confirmations: !options?.confirmations ? 1 : options?.confirmations,
    hash: transactionHash,
  })

  // If onConfirmation is provided, call it
  if (options?.onConfirmation) {
    options.onConfirmation(receipt)
  }

  const { contractAddress } = receipt

  const result = {
    contractAddress,
    transactionHash,
  }

  return result
}
