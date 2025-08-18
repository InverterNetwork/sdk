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
 * @template TRequestedModules - The requested modules to deploy
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
export async function deployWorkflow<
  TRequestedModules extends MixedRequestedModules,
  TUseTags extends boolean = true,
>({
  requestedModules,
  useTags = true as TUseTags,
  ...params
}: DeployWorkflowParams<TRequestedModules, TUseTags>): Promise<
  DeployWorkflowReturnType<TRequestedModules, TUseTags>
> {
  const inputs = getDeployWorkflowInputs(requestedModules)

  const { publicClient, walletClient, tagConfig } = params

  // Get the methods from the Viem handler
  const { run, simulate, estimateGas, bytecode } = await getMethods({
    requestedModules,
    publicClient,
    walletClient,
    tagConfig,
    useTags,
  })

  return {
    inputs,
    run,
    simulate,
    estimateGas,
    bytecode,
  } as DeployWorkflowReturnType<TRequestedModules, TUseTags>
}
