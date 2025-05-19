// sdk types
import type {
  DeployWorkflowParams,
  DeployWorkflowReturnType,
  MixedRequestedModules,
} from '@/types'

// get-deploy utils
import { getDeployWorkflowInputs } from './get-inputs'
import getMethods from './get-methods'

/**
 * @description Get the deploy functions for workflow deployment
 * @template T - The requested modules to deploy
 * @param params - The parameters for the preperation of the deploy function
 * @returns The result of the deploy function
 * @example
 * ```ts
 * const { run, simulate, estimateGas, bytecode } = await deployWorkflow({
 *   requestedModules,
 * })
 *
 * const result = await run(args)
 * ```
 */
export async function deployWorkflow<T extends MixedRequestedModules>({
  requestedModules,
  ...params
}: DeployWorkflowParams<T>): Promise<DeployWorkflowReturnType<T>> {
  const inputs = getDeployWorkflowInputs(requestedModules)

  const { publicClient, walletClient } = params

  // Get the methods from the Viem handler
  const { run, simulate, estimateGas, bytecode } = await getMethods({
    requestedModules,
    publicClient,
    walletClient,
  })

  return {
    inputs,
    run,
    simulate,
    estimateGas,
    bytecode,
  }
}
