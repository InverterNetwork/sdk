// external dependencies
import { getModuleData } from '@inverter-network/abis'
import { getFactoryAddress } from '@/deploy-workflow/utils'
import { getModule } from '@/get-module'
// sdk types
import type {
  Deploy,
  DeployableContracts,
  DeployParams,
  DeployWriteReturnType,
  MethodOptions,
} from '@/types'
// sdk utils
import { processInputs } from '@/utils'
import d from 'debug'
import { encodeDeployData } from 'viem'

const debug = d('inverter:sdk:deploy')

/**
 * @description Deploy a contract
 * @template TDeployableContracts - Name of the contract
 * @param params.name - The name of the contract
 * @param params.walletClient - The wallet client
 * @param params.publicClient - The public client
 * @param params.args - The arguments for the contract
 * @param options - The options for the deployment call
 * @returns The result of the deployment
 * * @example
 * ```ts
 * const { contractAddress, transactionHash } = await deployWrite({
 *   name: 'ERC20Issuance_v1',
 *   walletClient,
 *   publicClient,
 *   args: [],
 * })
 * ```
 */
export async function deployWrite<
  TDeployableContracts extends DeployableContracts,
  TUseTags extends boolean = true,
>(
  {
    name,
    walletClient,
    publicClient,
    args,
    useTags,
  }: DeployParams<TDeployableContracts, TUseTags>,
  options?: MethodOptions
): Promise<DeployWriteReturnType> {
  // Get the module data
  const moduleData = getModuleData<TDeployableContracts>(name)
  if (!('deploymentInputs' in moduleData)) {
    throw new Error('Invalid module data')
  }
  // Process the arguments
  debug('DEPLOYING CONTRACT:', name)
  const handledArgs = moduleData.deploymentInputs.configData.map(
    (input) => (args as any)?.[input.name]
  )
  const processedArgs = await processInputs({
    args: handledArgs,
    extendedInputs: moduleData.deploymentInputs.configData,
    publicClient,
    kind: 'write',
    useTags,
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

/**
 * @description Deploy a contract bytecode
 * @template TDeployableContracts - Name of the contract
 * @param params.name - The name of the contract
 * @param params.args - The arguments for the contract
 * @param params.publicClient - The public client
 * @param params.walletClient - The wallet client
 * @returns The result of the deployment
 * * @example
 * ```ts
 * const { run, factoryAddress, contractAddress } = await deployBytecode({
 *   name: 'ERC20Issuance_v1',
 *   args: [],
 *   publicClient,
 *   walletClient,
 * })
 * ```
 */
export async function deployBytecode<
  TDeployableContracts extends DeployableContracts,
  TUseTags extends boolean = true,
>({
  name,
  args,
  publicClient,
  walletClient,
  useTags,
}: DeployParams<TDeployableContracts, TUseTags>) {
  const moduleData = getModuleData<TDeployableContracts>(name)
  if (!('deploymentInputs' in moduleData)) {
    throw new Error('Invalid module data')
  }
  // Get the factory address
  const chainId = publicClient.chain.id
  const factoryAddress = await getFactoryAddress({
    version: 'v1.0.0',
    chainId,
  })
  // Get the factory module
  const factory = getModule({
    name: 'OrchestratorFactory_v1',
    publicClient,
    address: factoryAddress,
    walletClient,
  })
  // Process the arguments
  debug('GENERATING BYTECODE:', name)
  const handledArgs = moduleData.deploymentInputs.configData.map(
    (input) => (args as any)?.[input.name]
  )
  const processedArgs = await processInputs({
    args: handledArgs,
    extendedInputs: moduleData.deploymentInputs.configData,
    publicClient,
    kind: 'write',
    useTags,
  })

  // Encoding constructor arguments with the bytecode
  const encodedBytecode = encodeDeployData({
    abi: moduleData.abi,
    bytecode: moduleData.deploymentInputs.bytecode,
    args: processedArgs.processedInputs as any,
  })

  // Define the run function / which will generate the bytecode
  const run = async (call?: `0x${string}`[]) => {
    // Get the factory bytecode
    const deployBytecode = await factory.bytecode.deployExternalContract.run([
      encodedBytecode,
      call ?? [],
    ])

    return deployBytecode
  }

  const contractAddress = (
    await factory.simulate.deployExternalContract.run([encodedBytecode, []])
  ).result

  // Return the result with proper typing
  return {
    run,
    factoryAddress,
    contractAddress,
  }
}

/**
 * @description The deploy object
 */
export const deploy: Deploy = {
  write: deployWrite,
  bytecode: deployBytecode,
}
