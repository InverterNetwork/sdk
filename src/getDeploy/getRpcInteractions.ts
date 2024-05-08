import { getModuleData } from '@inverter-network/abis'
import { PublicClient, WalletClient, encodeAbiParameters } from 'viem'
import { GetDeploymentArgs } from '../types'
import { MANDATORY_MODULES } from './constants'
import {
  ConstructedArgs,
  EncodedArgs,
  ModuleArgs,
  RequestedModule,
  RequestedModules,
  GetUserArgs,
  UserModuleArg,
  UserArgs,
} from './types'
import { assembleMetadata, getViemMethods } from './utils'
import { Entries } from 'type-fest'
import parseInputs from '../utils/parseInputs'

const getEncodedArgs = async (
  deploymentArgs: GetDeploymentArgs,
  publicClient: PublicClient,
  userModuleArgs?: UserModuleArg
) => {
  // Initialize empty encodedArgs
  const encodedArgs = {} as EncodedArgs

  const encodedDeploymentArgs = await Promise.all(
    (Object.entries(deploymentArgs) as Entries<typeof deploymentArgs>).map(
      async ([, dataArr]) => {
        const paramValueContainer = Array(dataArr.length)
        const paramTypeContainer = Array(dataArr.length)

        for (const argName in userModuleArgs) {
          // find index in config
          const idx = dataArr.findIndex((config) => config.name === argName)
          // if index is found
          if (idx >= 0) {
            // put arg in the correct idx in param container
            paramValueContainer[idx] = userModuleArgs[argName]
            // put type in the correct idx in type container
            paramTypeContainer[idx] = { type: dataArr[idx].type }
          }
        }

        const formattedValueParams = (await parseInputs({
          formattedInputs: dataArr,
          args: paramValueContainer,
          extras: {},
          publicClient,
        })) as any[]

        return encodeAbiParameters(paramTypeContainer, formattedValueParams)
      }
    )
  )

  ;(Object.entries(deploymentArgs) as Entries<typeof deploymentArgs>).forEach(
    ([key], idx) => {
      encodedArgs[key] = encodedDeploymentArgs[idx]
    }
  )

  // Return encodedArgs
  return encodedArgs
}

const assembleModuleArgs = async (
  { name, version }: RequestedModule,
  publicClient: PublicClient,
  userModuleArgs?: UserModuleArg
): Promise<ModuleArgs> => {
  const { deploymentArgs } = getModuleData(name, version)
  const moduleArgs = {
    ...(await getEncodedArgs(deploymentArgs, publicClient, userModuleArgs)),
    metadata: assembleMetadata(name, version),
  }
  return moduleArgs
}

const constructArgs = async (
  requestedModules: RequestedModules,
  userArgs: UserArgs,
  publicClient: PublicClient
) => {
  // Initialize args
  const args = {
    orchestrator: userArgs.orchestrator,
    fundingManager: {},
    authorizer: {},
    paymentProcessor: {},
    optionalModules: [],
  } as unknown as ConstructedArgs

  const mandatoryModuleArgs = await Promise.all(
    MANDATORY_MODULES.map((moduleType) =>
      assembleModuleArgs(
        requestedModules[moduleType],
        publicClient,
        userArgs[moduleType]!
      )
    )
  )
  mandatoryModuleArgs.forEach((argObj, idx) => {
    args[MANDATORY_MODULES[idx]] = argObj
  })

  // optional modules
  const { optionalModules } = requestedModules
  if (optionalModules && optionalModules?.length > 0) {
    const optionalModulesArgs = await Promise.all(
      optionalModules.map((optionalModule) =>
        assembleModuleArgs(
          optionalModule,
          publicClient,
          userArgs.optionalModules?.[optionalModule.name]
        )
      )
    )
    optionalModulesArgs.forEach((argObj) => {
      args.optionalModules.push(argObj)
    })
  }

  return args
}

async function getArgs<T extends RequestedModules>(
  requestedModules: T,
  userArgs: GetUserArgs<T>,
  publicClient: PublicClient
) {
  const {
    orchestrator,
    fundingManager,
    authorizer,
    paymentProcessor,
    optionalModules,
  } = await constructArgs(requestedModules, userArgs, publicClient)

  return [
    orchestrator,
    fundingManager,
    authorizer,
    paymentProcessor,
    optionalModules,
  ] as const
}

export default function getRpcInteractions<T extends RequestedModules>(
  publicClient: PublicClient,
  walletClient: WalletClient,
  requestedModules: T
) {
  const { write, simulate } = getViemMethods(walletClient, publicClient)

  const simulateRun = async (userArgs: GetUserArgs<T>) => {
    const arr = await getArgs(requestedModules, userArgs, publicClient)
    return await simulate(arr, {
      // @ts-expect-error - TODO: add Account and Chain to wallet client type props
      account: walletClient.account.walletAddress,
    })
  }

  const run = async (userArgs: GetUserArgs<T>) => {
    const arr = await getArgs(requestedModules, userArgs, publicClient)
    // Return the write function with the args
    return (async () => {
      // prettier-ignore
      const orchestratorAddress = (await simulate(arr, {
        // @ts-expect-error - TODO: add Account and Chain to wallet client type props
        account: walletClient.account.walletAddress,
      })).result
      const transactionHash = await write(arr, {} as any)

      return {
        orchestratorAddress,
        transactionHash,
      }
    })()
  }

  return { run, simulateRun }
}
