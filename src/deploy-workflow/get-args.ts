// external dependencies
import { getModuleData } from '@inverter-network/abis'
// sdk types
import type { Inverter } from '@/inverter'
import type {
  ConstructedArgs,
  DeployMethodKind,
  GetDeployWorkflowArgs,
  GetModuleDeploymentInputs,
  MixedRequestedModules,
  ModuleArgs,
  ModuleData,
  PopWalletClient,
  RequestedModule,
  TagConfig,
  UserArgs,
  UserModuleArg,
} from '@/types'
// sdk utils
import { processInputs } from '@/utils'
import { encodeAbiParameters, zeroAddress } from 'viem'
import type { PublicClient } from 'viem'

// get-deploy constants
import { MANDATORY_MODULES } from './constants'
// get-deploy utils
import { assembleMetadata, getDefaultToken } from './utils'

let tagConfig: TagConfig

/**
 * @description The shared parameters for the getArgs function and its utils
 */
export type DeployWorkflowGetArgsSharedParams = {
  publicClient: PublicClient
  walletClient: PopWalletClient
  kind: DeployMethodKind
  self?: Inverter
  tagConfig?: TagConfig
  useTags?: boolean
}

/**
 * @description Encodes arguments for a module based on configuration data and user-provided arguments.
 */
export const getEncodedArgs = async ({
  deploymentInputs,
  userModuleArg,
  ...params
}: {
  deploymentInputs: GetModuleDeploymentInputs | ModuleData['deploymentInputs']
  userModuleArg?: UserModuleArg
} & DeployWorkflowGetArgsSharedParams): Promise<`0x${string}`> => {
  // Get the configuration data for the module
  const { configData } = deploymentInputs || { configData: [] as any[] }
  // Itterate through the formatted inputs and get the user provided arguments
  const args = userModuleArg
    ? configData.map((input) => userModuleArg?.[input.name])
    : '0x00'
  // Process the inputs
  const { processedInputs } = <any>await processInputs({
    extendedInputs: configData,
    args,
    tagConfig,
    ...params,
  })

  // Encode the processed inputs
  const encodedArgs = encodeAbiParameters(configData, processedInputs)
  // Return the encoded arguments
  return encodedArgs
}

/**
 * @description Assembles the arguments into evm encoded arguments for a module
 */
export const assembleModuleArgs = async ({
  requestedModule,
  ...params
}: {
  requestedModule: RequestedModule | ModuleData
  userModuleArg?: UserModuleArg
} & DeployWorkflowGetArgsSharedParams): Promise<ModuleArgs> => {
  // Get the deployment inputs for the module
  const { deploymentInputs } =
    typeof requestedModule === 'object'
      ? requestedModule
      : getModuleData(requestedModule)

  // Get the encoded arguments for the module = encoded configData
  const configData = await getEncodedArgs({
    deploymentInputs,
    ...params,
  })
  // Assempble the metadata for the module
  const metadata = assembleMetadata(requestedModule)
  // Return the module arguments
  return {
    configData,
    metadata,
  }
}

/**
 * @description Constructs the arguments required for the requested modules.
 */
export const constructArgs = async ({
  requestedModules,
  userArgs,
  ...rest
}: {
  requestedModules: MixedRequestedModules
  userArgs: UserArgs
} & DeployWorkflowGetArgsSharedParams) => {
  let orchestrator = userArgs?.orchestrator
  // If orchestrator is not provided, set it to default values
  if (!orchestrator?.independentUpdates)
    orchestrator = {
      independentUpdates: false,
      independentUpdateAdmin: zeroAddress,
    }

  // Set up the initial arguments
  const args = {
    orchestrator,
    fundingManager: {},
    authorizer: {},
    paymentProcessor: {},
    optionalModules: [],
  } as unknown as ConstructedArgs

  // Get the default token if the funding manager is provided
  if (
    rest.useTags &&
    userArgs.fundingManager &&
    !tagConfig?.defaultToken &&
    !tagConfig?.decimals
  ) {
    try {
      const { defaultToken, decimals } = await getDefaultToken(
        rest.publicClient,
        userArgs.fundingManager
      )
      tagConfig = {
        ...tagConfig,
        defaultToken,
        decimals,
      }
    } catch {}
  }

  // Get the arguments for the mandatory modules
  let mendatoryModuleIdx = 0
  for (const moduleType of MANDATORY_MODULES) {
    const argObj = await assembleModuleArgs({
      requestedModule: requestedModules[moduleType],
      userModuleArg: userArgs[moduleType],
      tagConfig,
      ...rest,
    })
    args[MANDATORY_MODULES[mendatoryModuleIdx]] = argObj
    mendatoryModuleIdx++
  }

  // spread to the optional modules
  const { optionalModules } = requestedModules

  // If optional modules are provided, get the arguments for them
  if (optionalModules && optionalModules.length > 0) {
    // Get the arguments for the optional
    for (const optionalModule of optionalModules) {
      const argObj = await assembleModuleArgs({
        requestedModule: optionalModule,
        userModuleArg:
          userArgs.optionalModules?.[
            typeof optionalModule === 'object'
              ? optionalModule.name
              : optionalModule
          ],
        ...rest,
      })
      // Assign the optional module arguments to the args object
      args.optionalModules.push(argObj)
    }
  }

  return args
}

/**
 * @description Retrieves the arguments required for the requested modules.
 */
export default async function getArgs<
  TRequestedModules extends MixedRequestedModules,
  TUseTags extends boolean = true,
>(
  params: {
    requestedModules: TRequestedModules
    userArgs: GetDeployWorkflowArgs<TRequestedModules, TUseTags>
  } & DeployWorkflowGetArgsSharedParams
) {
  // If tagConfig is provided, set it
  if (params.tagConfig) tagConfig = params.tagConfig
  // Construct the arguments in a object
  const constructed = await constructArgs(params)
  // Return the arguments as an array
  const baseArr = [
    constructed.orchestrator,
    constructed.fundingManager,
    constructed.authorizer,
    constructed.paymentProcessor,
    constructed.optionalModules,
  ] as const

  return baseArr
}
