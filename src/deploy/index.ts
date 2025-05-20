// external dependencies
import { getModuleData } from '@inverter-network/abis'
import { getFactoryAddress } from '@/deploy-workflow/utils'
import { getModule } from '@/get-module'
// sdk types
import type {
  Deploy,
  DeployableContracts,
  DeployBytecodeParams,
  DeployBytecodeRunParams,
  DeployWriteParams,
  MethodOptions,
} from '@/types'
// sdk utils
import { processInputs } from '@/utils'
import { encodeDeployData, getContractAddress } from 'viem'
import type { Address } from 'viem'

/**
 * @description Deploy a contract
 * @param params.name - The name of the contract
 * @param params.walletClient - The wallet client
 * @param params.publicClient - The public client
 * @param params.args - The arguments for the contract
 * @param options - The options for the deployment call
 * @returns The result of the deployment
 */
export async function deployWrite<T extends DeployableContracts>(
  { name, walletClient, publicClient, args }: DeployWriteParams<T>,
  options?: MethodOptions
) {
  // Get the module data
  const moduleData = getModuleData<T>(name)
  if (!('deploymentInputs' in moduleData)) {
    throw new Error('Invalid module data')
  }
  // Process the arguments
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
  // If contract address is undefined, throw an error
  const { contractAddress } = receipt
  if (!contractAddress) {
    throw new Error(
      `Contract address has returned undefined @ ${name} deployment`
    )
  }
  // Return the result
  return {
    contractAddress,
    transactionHash,
  }
}

export async function deployBytecode<T extends DeployableContracts>({
  name,
  publicClient,
}: DeployBytecodeParams<T>) {
  const moduleData = getModuleData<T>(name)
  if (!('deploymentInputs' in moduleData)) {
    throw new Error('Invalid module data')
  }
  // Get the factory address
  const chainId = publicClient.chain.id
  const factoryAddress = await getFactoryAddress({
    version: 'v1.0.0',
    chainId,
  })
  if (!factoryAddress) {
    throw new Error(`Factory address not found for chainId ${chainId}`)
  }
  // Get the factory module
  const factory = getModule({
    name: 'OrchestratorFactory_v1',
    publicClient,
    address: factoryAddress,
  })
  // Define the run function / which will generate the bytecode
  const run = async (params: DeployBytecodeRunParams<T>) => {
    // Process the arguments
    const handledArgs = moduleData.deploymentInputs.configData.map(
      (input) => (params.args as any)?.[input.name]
    )
    const processedArgs = await processInputs({
      args: handledArgs,
      extendedInputs: moduleData.deploymentInputs.configData,
      publicClient,
      kind: 'write',
    })

    // Encoding constructor arguments with the bytecode
    const encodedBytecode = encodeDeployData({
      abi: moduleData.abi,
      bytecode: moduleData.deploymentInputs.bytecode,
      args: processedArgs.processedInputs as any,
    })
    // Get the factory bytecode
    const deployBytecode = await factory.bytecode.deployExternalContract.run([
      encodedBytecode,
      params.calls ?? ['0x'],
    ])
    return deployBytecode
  }
  // Simulate the contract address
  const factoryNonce = await publicClient.getTransactionCount({
    address: factoryAddress as Address,
  })
  // Calculate the predicted contract address
  const contractAddress = getContractAddress({
    from: factoryAddress as Address,
    nonce: BigInt(factoryNonce),
  })
  // Return the result with proper typing
  return {
    run,
    factoryAddress,
    contractAddress,
  }
}

export const deploy: Deploy = {
  write: deployWrite,
  bytecode: deployBytecode,
}
