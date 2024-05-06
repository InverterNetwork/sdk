import { getModuleData } from '@inverter-network/abis'
import { WalletClient, encodeAbiParameters } from 'viem'
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
import { assembleMetadata, getWriteFn } from './utils'
import { Entries } from 'type-fest'

const getEncodedArgs = (
  userModuleArgs: UserModuleArg,
  deploymentArgs: GetDeploymentArgs
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
  userModuleArgs: UserModuleArg
): ModuleArgs => {
  const { deploymentArgs } = getModuleData(name, version)
  const moduleArgs = {
    ...getEncodedArgs(userModuleArgs, deploymentArgs),
    metadata: assembleMetadata(name, version),
  }
  return moduleArgs
}

const constructArgs = (
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

  // itterate mandatory modules
  MANDATORY_MODULES.forEach((moduleType) => {
    const moduleArgs = assembleModuleArgs(
      requestedModules[moduleType],
      userArgs[moduleType]!
    )
    args[moduleType] = moduleArgs
  })

  // optional modules
  const { optionalModules } = requestedModules
  if (optionalModules && optionalModules?.length > 0) {
    optionalModules.forEach((optionalModule) => {
      const moduleArgs = assembleModuleArgs(
        optionalModule,
        userArgs.optionalModules![optionalModule.name]
      )
      args.optionalModules.push(moduleArgs)
    })
  }

  return args
}

export default function getRun<T extends RequestedModules>(
  walletClient: WalletClient,
  requestedModules: T
) {
  const run = (userArgs: GetUserArgs<T>) => {
    // Construct the args
    const {
      orchestrator,
      fundingManager,
      authorizer,
      paymentProcessor,
      optionalModules,
    } = constructArgs(requestedModules, userArgs)

    // Return the write function with the args
    return getWriteFn(walletClient)(
      [
        orchestrator,
        fundingManager,
        authorizer,
        paymentProcessor,
        optionalModules,
      ],
      {} as any
    )
  }

  return run
}
