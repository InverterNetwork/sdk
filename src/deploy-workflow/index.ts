// sdk types
import type {
  FactoryType,
  DeployWorkflowParams,
  DeployWorkflowReturnType,
  RequestedModules,
} from '@/types'

// get-deploy utils
import { getDeployWorkflowInputs } from './get-inputs'
import getMethods from './get-methods'

/**
 * @description Get the deploy function for workflow deployment
 * @template T - The requested modules to deploy
 * @param params - The parameters for the preperation of the deploy function
 * @returns The result of the deploy function
 */
export async function deployWorkflow<
  T extends RequestedModules<FT extends undefined ? 'default' : FT>,
  FT extends FactoryType | undefined = undefined,
>({
  requestedModules,
  factoryType,
  ...params
}: DeployWorkflowParams<T, FT>): Promise<DeployWorkflowReturnType<T, FT>> {
  const defaultFactoryType = (factoryType ?? 'default') as FT extends undefined
    ? 'default'
    : FT

  const inputs = getDeployWorkflowInputs(requestedModules, defaultFactoryType)

  const { publicClient, walletClient } = params

  // Get the methods from the Viem handler
  const { run, simulate, estimateGas } = await getMethods({
    requestedModules,
    factoryType: defaultFactoryType,
    publicClient,
    walletClient,
  })

  return {
    inputs,
    run,
    simulate,
    estimateGas,
  }
}
