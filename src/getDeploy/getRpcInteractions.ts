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

const getEncodedArgs = (
  deploymentArgs: GetDeploymentArgs,
  userModuleArgs?: UserModuleArg
) => {
  // Initialize empty encodedArgs
  const encodedArgs = {} as EncodedArgs

  // iterate over config and dependency data
  ;(Object.entries(deploymentArgs) as Entries<typeof deploymentArgs>).forEach(
    ([key, dataArr]) => {
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

      // set encodedArgs[key] to the encoded value of the args
      encodedArgs[key] = encodeAbiParameters(
        paramTypeContainer,
        paramValueContainer
      )
    }
  )

  // Return encodedArgs
  return encodedArgs
}

const assembleModuleArgs = (
  { name, version }: RequestedModule,
  userModuleArgs?: UserModuleArg
): ModuleArgs => {
  const { deploymentArgs } = getModuleData(name, version)
  const moduleArgs = {
    ...getEncodedArgs(deploymentArgs, userModuleArgs),
    metadata: assembleMetadata(name, version),
  }
  return moduleArgs
}

const constructArgs = async (
  requestedModules: RequestedModules,
  userArgs: UserArgs
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
      assembleModuleArgs(requestedModules[moduleType], userArgs[moduleType]!)
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
  userArgs: GetUserArgs<T>
) {
  const {
    orchestrator,
    fundingManager,
    authorizer,
    paymentProcessor,
    optionalModules,
  } = await constructArgs(requestedModules, userArgs)

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
    const arr = await getArgs(requestedModules, userArgs)
    return await simulate(arr, {
      // @ts-expect-error - TODO: add Account and Chain to wallet client type props
      account: walletClient.account.walletAddress,
    })
  }

  const run = async (userArgs: GetUserArgs<T>) => {
    const arr = await getArgs(requestedModules, userArgs)
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
