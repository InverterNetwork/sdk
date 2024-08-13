import { getModuleData } from '@inverter-network/abis'
import { MANDATORY_MODULES } from './constants'
import { assembleMetadata, getDefaultToken, getViemMethods } from './utils'
import processInputs from '../utils/processInputs'
import formatParameters from '../utils/formatParameters'
import { Inverter } from '../Inverter'
import { ADDRESS_ZERO } from '../utils/constants'

import {
  type PublicClient,
  decodeErrorResult,
  encodeAbiParameters,
  formatEther,
  parseUnits,
} from 'viem'
import type {
  Extras,
  GetDeploymentInputs,
  PopWalletClient,
  ConstructedArgs,
  ModuleArgs,
  RequestedModule,
  RequestedModules,
  GetUserArgs,
  UserModuleArg,
  UserArgs,
  MethodKind,
  EstimateGasReturn,
  FactoryType,
} from '../types'

let extras: Extras

type JointParams = {
  publicClient: PublicClient
  walletClient: PopWalletClient
  kind: MethodKind
  self?: Inverter
}

/**
 * Encodes arguments for a module based on configuration data and user-provided arguments.
 */
export const getEncodedArgs = async ({
  deploymentInputs,
  userModuleArg,
  ...params
}: {
  deploymentInputs: GetDeploymentInputs
  userModuleArg?: UserModuleArg
} & JointParams): Promise<`0x${string}`> => {
  // Get the configuration data for the module
  const { configData } = deploymentInputs
  // Format the configuration data
  const formattedInputs = formatParameters({ parameters: configData })
  // Itterate through the formatted inputs and get the user provided arguments
  const args = userModuleArg
    ? formattedInputs.map((input) => userModuleArg?.[input.name])
    : '0x00'
  // Process the inputs
  const { processedInputs } = <any>await processInputs({
    formattedInputs,
    args,
    extras,
    ...params,
  })
  // Encode the processed inputs
  const encodedArgs = encodeAbiParameters(configData, processedInputs)
  // Return the encoded arguments
  return encodedArgs
}

export const assembleModuleArgs = async ({
  name,
  ...params
}: {
  name: RequestedModule
  userModuleArg?: UserModuleArg
} & JointParams): Promise<ModuleArgs> => {
  // Get the deployment inputs for the module
  const { deploymentInputs } = getModuleData(name)
  // Get the encoded arguments for the module = encoded configData
  const configData = await getEncodedArgs({
    deploymentInputs,
    ...params,
  })
  // Assempble the metadata for the module
  const metadata = assembleMetadata(name)
  // Return the module arguments
  return {
    configData,
    metadata,
  }
}

/**
 * Constructs the arguments required for the requested modules.
 */
export const constructArgs = async ({
  requestedModules,
  userArgs,
  factoryType,
  ...rest
}: {
  factoryType: FactoryType
  requestedModules: RequestedModules
  userArgs: UserArgs
} & JointParams) => {
  let orchestrator = userArgs?.orchestrator
  // If orchestrator is not provided, set it to default values
  if (!orchestrator?.independentUpdates)
    orchestrator = {
      independentUpdates: false,
      independentUpdateAdmin: ADDRESS_ZERO,
    }

  // Set up the initial arguments
  const args = {
    orchestrator,
    fundingManager: {},
    authorizer: {},
    paymentProcessor: {},
    optionalModules: [],
    issuanceToken: {},
  } as unknown as ConstructedArgs

  // Get the default token if the funding manager is provided
  if (userArgs.fundingManager)
    extras = await getDefaultToken(rest.publicClient, userArgs.fundingManager)

  // Get the arguments for the mandatory modules
  await Promise.all(
    MANDATORY_MODULES.map(async (moduleType, idx) => {
      // Get the arguments for the module
      const argObj = await assembleModuleArgs({
        name: requestedModules[moduleType],
        userModuleArg: userArgs[moduleType],
        ...rest,
      })
      // Assign the mandatory module arguments to the args object
      args[MANDATORY_MODULES[idx]] = argObj
    })
  )

  const { optionalModules } = requestedModules

  // If optional modules are provided, get the arguments for them
  if (optionalModules && optionalModules.length > 0) {
    await Promise.all(
      optionalModules.map(async (optionalModule) => {
        // Get the arguments for the optional module
        const argObj = await assembleModuleArgs({
          name: optionalModule,
          userModuleArg: userArgs.optionalModules?.[optionalModule],
          ...rest,
        })
        // Assign the optional module arguments to the args object
        args.optionalModules.push(argObj)
      })
    )
  }

  if (factoryType === 'restricted-pim') {
    if (!userArgs.issuanceToken) throw new Error('Issuance token is required')
    args.issuanceToken = {
      ...userArgs.issuanceToken,
      maxSupply: String(
        parseUnits(
          userArgs.issuanceToken.maxSupply,
          Number(userArgs.issuanceToken.decimals)
        )
      ),
    }
  }

  return args
}

/**
 * Retrieves the arguments required for the requested modules.
 */
export async function getArgs<
  T extends RequestedModules,
  FT extends FactoryType = 'default',
>(
  params: {
    requestedModules: T
    factoryType: FT
    userArgs: GetUserArgs<T, FT>
  } & JointParams
) {
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

  const restrictedPimArr = [
    ...baseArr,
    (constructed as ConstructedArgs).issuanceToken,
  ] as const

  const result = (
    params.factoryType === 'restricted-pim' ? restrictedPimArr : baseArr
  ) as FT extends 'restricted-pim' ? typeof restrictedPimArr : typeof baseArr

  return result
}

/**
 * Provides RPC interactions for the requested modules.
 */
export default async function getRpcInteractions<
  T extends RequestedModules,
  FT extends FactoryType,
>(
  params: {
    requestedModules: T
    factoryType: FT
  } & Omit<JointParams, 'kind'>
) {
  const { publicClient, walletClient, requestedModules, factoryType } = params

  const abi = getModuleData(
    (() => {
      switch (factoryType) {
        case 'default':
          return 'OrchestratorFactory_v1'
        case 'restricted-pim':
          return 'Restricted_PIM_Factory_v1'
        default:
          throw new Error('Unsupported factory type')
      }
    })()
  ).abi

  // Get the methods from the Viem handler
  const {
    write,
    simulateWrite,
    estimateGas: esitmateGasOrg,
  } = await getViemMethods({
    walletClient,
    publicClient,
    factoryType,
    abi,
  })

  // Simulate the deployment
  const simulate = async (userArgs: GetUserArgs<T, FT>) => {
    try {
      const arr = await getArgs({ userArgs, kind: 'simulate', ...params })
      return await simulateWrite(arr, {
        account: walletClient.account.address,
      })
    } catch (e: any) {
      throw handleError(requestedModules, e)
    }
  }

  // Run the deployment = write
  const run = async (userArgs: GetUserArgs<T, FT>) => {
    try {
      const arr = await getArgs({ userArgs, kind: 'write', ...params })

      const simulationRes = await simulateWrite(arr, {
        account: walletClient.account.address,
      })

      const orchestratorAddress = simulationRes.result

      const transactionHash = await write(arr, {} as any)

      return {
        orchestratorAddress,
        transactionHash,
      }
    } catch (e: any) {
      throw handleError(requestedModules, e)
    }
  }

  // Estimate the gas for the deployment
  const estimateGas = async (
    userArgs: GetUserArgs<T, FT>
  ): Promise<EstimateGasReturn> => {
    try {
      const arr = await getArgs({ userArgs, kind: 'estimateGas', ...params })

      const value = String(
        await esitmateGasOrg(arr, {
          account: walletClient.account.address,
        })
      )

      const formatted = formatEther(BigInt(value))

      return {
        value,
        formatted,
      }
    } catch (e: any) {
      throw handleError(requestedModules, e)
    }
  }

  return { run, simulate, estimateGas }
}

const handleError = (requestedModules: RequestedModules, error: any) => {
  if (!error?.message?.includes?.('Unable to decode signature')) return error
  const signature = error.cause.signature as `0x${string}`

  let errorName: string | undefined

  const abis = [
    getModuleData('OrchestratorFactory_v1').abi,
    ...Object.values(requestedModules)
      .flat()
      .map((i) => getModuleData(i).abi),
  ]

  abis.forEach((abi) => {
    try {
      const value = decodeErrorResult({
        abi,
        data: signature,
      })
      if (value.errorName) errorName = value.errorName
    } catch {
      // do nothing
    }
  })

  if (!errorName) return error

  return new Error(errorName)
}
