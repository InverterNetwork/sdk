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
  UserArgs,
  UserModuleArg,
} from './types'
import { assembleMetadata, getWriteFn } from './utils'

const getEncodedArgs = <T extends RequestedModule>(
  userModuleArgs: UserModuleArg<
    T['name'],
    // @ts-expect-error - TS doesn't resolve version
    T['version']
  >,
  deploymentArgs: GetDeploymentArgs
) => {
  // Initialize empty encodedArgs
  const encodedArgs = {} as EncodedArgs
  // Get module deployment args and name
  const { configData, dependencyData } = deploymentArgs
  // iterate over config and dependency data
  ;[configData, dependencyData].forEach((dataArr, index) => {
    const paramValueContainer = Array(dataArr.length)
    const paramTypeContainer = Array(dataArr.length)
    for (const paramName in userModuleArgs) {
      // find index in config
      const idx = dataArr.findIndex((config: any) => config.name === paramName)
      if (idx >= 0) {
        const { type } = dataArr[idx]
        // put param in correct idx in param container
        paramValueContainer[idx] = userModuleArgs[paramName]
        paramTypeContainer[idx] = { type }
      }
    }
    const key = index === 0 ? 'configData' : 'dependencyData'
    encodedArgs[key] = encodeAbiParameters(
      paramTypeContainer,
      paramValueContainer
    )
  })
  // Return encodedArgs
  return encodedArgs
}

const assembleModuleArgs = <T extends RequestedModule>(
  requestedModule: RequestedModule,
  userModuleArgs: UserModuleArg<
    T['name'],
    // @ts-expect-error - TS doesn't resolve version
    T['version']
  >
) => {
  const { name, version } = requestedModule
  const { deploymentArgs } = getModuleData(name, version)!
  const moduleArgs: ModuleArgs = {
    ...getEncodedArgs(userModuleArgs, deploymentArgs),
    metadata: assembleMetadata(name, version),
  }
  return moduleArgs
}

const constructArgs = <T extends RequestedModules>(
  requestedModules: T,
  userArgs: UserArgs<T>
) => {
  const args = {
    orchestrator: userArgs.orchestrator,
    fundingManager: {},
    authorizer: {},
    paymentProcessor: {},
    optionalModules: [],
  } as unknown as ConstructedArgs

  // mandatory modules
  MANDATORY_MODULES.forEach((moduleType) => {
    const moduleArgs = assembleModuleArgs(
      requestedModules[moduleType],
      // @ts-expect-error - TS doesn't resolve union
      userArgs[moduleType]
    )
    args[moduleType] = moduleArgs
  })

  // optional modules
  const { optionalModules } = requestedModules
  if (optionalModules && optionalModules?.length > 0) {
    optionalModules.forEach((optionalModule) => {
      const optionalModuleIndex = optionalModules.indexOf(optionalModule)
      const moduleArgs = assembleModuleArgs(
        optionalModule,
        // @ts-expect-error - TS doesn't resolve union
        userArgs.optionalModules[optionalModuleIndex]
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
  const run = (userArgs: UserArgs<T>) => {
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
