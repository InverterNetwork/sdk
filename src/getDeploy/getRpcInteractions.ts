import { getModuleData } from '@inverter-network/abis'
import { MANDATORY_MODULES } from './constants'
import { assembleMetadata, getDefaultToken, getViemMethods } from './utils'
import processInputs from '../utils/processInputs'
import formatParameters from '../utils/formatParameters'
import { Inverter } from '../Inverter'
import { ADDRESS_ZERO } from '../utils/constants'

import { type PublicClient, encodeAbiParameters, formatEther } from 'viem'
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
} from '../types'

let extras: Extras

type JointParams = {
  publicClient: PublicClient
  walletClient: PopWalletClient
  kind: MethodKind
  self?: Inverter
}

type GetEncodedArgsParams = {
  deploymentInputs: GetDeploymentInputs
  userModuleArg?: UserModuleArg
} & JointParams

/**
 * Encodes arguments for a module based on configuration data and user-provided arguments.
 *
 * @param {GetEncodedArgsParams} params - The parameters for encoding arguments.
 * @returns {Promise<string>} - The encoded arguments.
 */
export const getEncodedArgs = async ({
  deploymentInputs,
  userModuleArg,
  ...params
}: GetEncodedArgsParams): Promise<`0x${string}`> => {
  const { configData } = deploymentInputs
  const formattedInputs = formatParameters({ parameters: configData })
  const args = userModuleArg
    ? formattedInputs.map((input) => userModuleArg?.[input.name])
    : '0x00'

  const { processedInputs } = <any>await processInputs({
    formattedInputs,
    args,
    extras,
    ...params,
  })

  return encodeAbiParameters(configData, processedInputs)
}

type AssembleModuleArgsParams = {
  name: RequestedModule
  userModuleArg?: UserModuleArg
} & JointParams

/**
 * Assembles module arguments based on the module name and user-provided arguments.
 *
 * @param {AssembleModuleArgsParams} params - The parameters for assembling module arguments.
 * @returns {Promise<ModuleArgs>} - The assembled module arguments.
 */
export const assembleModuleArgs = async ({
  name,
  ...params
}: AssembleModuleArgsParams): Promise<ModuleArgs> => {
  const { deploymentInputs } = getModuleData(name)
  const encodedArgs = await getEncodedArgs({
    deploymentInputs,
    ...params,
  })

  return {
    configData: encodedArgs,
    metadata: assembleMetadata(name),
  }
}

type ConstructArgsParams = {
  requestedModules: RequestedModules
  userArgs: UserArgs
} & JointParams

/**
 * Constructs the arguments required for the requested modules.
 *
 * @param {ConstructArgsParams} params - The parameters for constructing arguments.
 * @returns {Promise<ConstructedArgs>} - The constructed arguments.
 */
export const constructArgs = async ({
  requestedModules,
  userArgs,
  publicClient,
  walletClient,
  self,
  kind,
}: ConstructArgsParams): Promise<ConstructedArgs> => {
  let orchestrator = userArgs?.orchestrator

  if (!orchestrator?.independentUpdates)
    orchestrator = {
      independentUpdates: false,
      independentUpdateAdmin: ADDRESS_ZERO,
    }

  const args = {
    orchestrator,
    fundingManager: {},
    authorizer: {},
    paymentProcessor: {},
    optionalModules: [],
  } as unknown as ConstructedArgs

  if (userArgs.fundingManager)
    extras = await getDefaultToken(publicClient, userArgs.fundingManager)

  const mandatoryModuleArgs = await Promise.all(
    MANDATORY_MODULES.map((moduleType) =>
      assembleModuleArgs({
        name: requestedModules[moduleType],
        userModuleArg: userArgs[moduleType],
        publicClient,
        walletClient,
        self,
        kind,
      })
    )
  )

  mandatoryModuleArgs.forEach((argObj, idx) => {
    args[MANDATORY_MODULES[idx]] = argObj
  })

  const { optionalModules } = requestedModules
  if (optionalModules && optionalModules.length > 0) {
    const optionalModulesArgs = await Promise.all(
      optionalModules.map((optionalModule) =>
        assembleModuleArgs({
          name: optionalModule,
          userModuleArg: userArgs.optionalModules?.[optionalModule],
          publicClient,
          walletClient,
          self,
          kind,
        })
      )
    )

    optionalModulesArgs.forEach((argObj) => {
      args.optionalModules.push(argObj)
    })
  }

  return args
}

type GetArgsParams<T extends RequestedModules> = {
  requestedModules: T
  userArgs: GetUserArgs<T>
} & JointParams

/**
 * Retrieves the arguments required for the requested modules.
 *
 * @param {GetArgsParams<T>} params - The parameters for retrieving arguments.
 * @returns The array of arguments.
 */
export async function getArgs<T extends RequestedModules>(
  props: GetArgsParams<T>
) {
  const constructed = await constructArgs(props)
  return [
    constructed.orchestrator,
    constructed.fundingManager,
    constructed.authorizer,
    constructed.paymentProcessor,
    constructed.optionalModules,
  ] as const
}

type GetRpcInteractionsParams<T extends RequestedModules> = {
  requestedModules: T
} & Omit<JointParams, 'kind'>

/**
 * Provides RPC interactions for the requested modules.
 *
 * @param {GetRpcInteractionsParams<T>} params - The parameters for RPC interactions.
 * @returns {Promise<{ run: Function, simulate: Function }>} - The RPC interaction functions.
 */
export default async function getRpcInteractions<T extends RequestedModules>({
  publicClient,
  walletClient,
  requestedModules,
  self,
}: GetRpcInteractionsParams<T>) {
  const {
    write,
    simulateWrite,
    estimateGas: esitmateGasOrg,
  } = await getViemMethods(walletClient, publicClient)

  const handleGetArgs = async (userArgs: GetUserArgs<T>, kind: MethodKind) => {
    const arr = await getArgs({
      requestedModules,
      userArgs,
      publicClient,
      walletClient,
      self,
      kind,
    })
    return arr
  }

  const simulate = async (userArgs: GetUserArgs<T>) => {
    const arr = await handleGetArgs(userArgs, 'simulate')
    return await simulateWrite(arr, {
      account: walletClient.account.address,
    })
  }

  const run = async (userArgs: GetUserArgs<T>) => {
    const arr = await handleGetArgs(userArgs, 'write')

    const simulationRes = await simulateWrite(arr, {
      account: walletClient.account.address,
    })

    const orchestratorAddress = simulationRes.result

    const transactionHash = await write(arr, {} as any)

    return {
      orchestratorAddress,
      transactionHash,
    }
  }

  const estimateGas = async (userArgs: GetUserArgs<T>) => {
    const arr = await handleGetArgs(userArgs, 'estimateGas')

    const value = await esitmateGasOrg(arr, {
      account: walletClient.account.address,
    })

    const formatted = formatEther(value)

    return {
      value,
      formatted,
    }
  }

  return { run, simulate, estimateGas }
}
