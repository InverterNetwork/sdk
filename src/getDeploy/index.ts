import { WalletClient } from 'viem'
import { encodeAbiParameters } from 'viem'
import { MANDATORY_MODULES } from './constants'
import {
  RequestedModules,
  ClientInputs,
  EncodedParams,
  ModuleParams,
  FinalArgs,
  OrchestratorArgs,
  MendatoryModuleType,
} from './types'
import { assembleMetadata, getWriteFn } from './utils'
import { getModuleData } from '@inverter-network/abis'
import getDeploySchema from './getDeploySchema'

const getEncodedParams = (clientInputs: any, moduleConfig: any) => {
  const encodedModuleParams: any = {}
  const { deploymentArgs, name } = moduleConfig
  const userModuleParams = clientInputs[name]
  const { configData, dependencyData } = deploymentArgs
  // iterate over userModuleParams
  ;[configData, dependencyData].forEach((dataArr, index) => {
    const paramValueContainer = Array(dataArr.length)
    const paramTypeContainer = Array(dataArr.length)
    for (const paramName in userModuleParams) {
      // find index in config
      const idx = dataArr.findIndex((config: any) => config.name === paramName)
      if (idx >= 0) {
        const { type } = dataArr[idx]
        // put param in correct idx in param container
        paramValueContainer[idx] = userModuleParams[paramName]
        paramTypeContainer[idx] = { type }
      }
    }
    const key = index === 0 ? 'configData' : 'dependencyData'
    encodedModuleParams[key] = encodeAbiParameters(
      paramTypeContainer,
      paramValueContainer
    )
  })
  return encodedModuleParams as EncodedParams
}

const assembleModuleArgs = (requestedModule: any, clientInputs: any) => {
  const { name, version } = requestedModule
  const moduleConfig = getModuleData(name, version)!
  const { moduleType } = moduleConfig
  const moduleArgs = {
    ...getEncodedParams(clientInputs, moduleConfig),
  } as ModuleParams
  moduleArgs.metadata = assembleMetadata(name, version)
  return { moduleType, moduleArgs }
}

const constructArgs = (
  requestedModules: RequestedModules,
  clientInputs: ClientInputs
) => {
  const args = {
    orchestrator: clientInputs.Orchestrator as OrchestratorArgs,
    fundingManager: {} as ModuleParams,
    authorizer: {} as ModuleParams,
    paymentProcessor: {} as ModuleParams,
    optionalModules: [] as ModuleParams[],
  } as FinalArgs
  // mandatory modules
  MANDATORY_MODULES.forEach((type) => {
    const userChoice = requestedModules[type]
    const { moduleType, moduleArgs } = assembleModuleArgs(
      userChoice,
      clientInputs
    )
    args[moduleType as MendatoryModuleType] = moduleArgs
  })
  // optional modules
  const { optionalModules } = requestedModules
  if (optionalModules && optionalModules?.length > 0) {
    optionalModules.forEach((module) => {
      const { moduleArgs } = assembleModuleArgs(module, clientInputs)
      args.optionalModules.push(moduleArgs)
    })
  }

  return args
}

export default async function <T extends RequestedModules>(
  walletClient: WalletClient,
  requestedModules: T
) {
  const inputSchema = getDeploySchema(requestedModules)

  const run = async (clientInputs: ClientInputs) => {
    const {
      orchestrator,
      fundingManager,
      authorizer,
      paymentProcessor,
      optionalModules,
    } = constructArgs(requestedModules, clientInputs)

    const writeFn = getWriteFn(walletClient)
    return writeFn(
      [
        orchestrator,
        fundingManager,
        authorizer,
        paymentProcessor,
        optionalModules,
      ],
      {} as any
    )
      .then((r: string) => r)
      .catch((e: Error) => {
        console.log(e)
        return e
      })
  }

  return { inputSchema, run }
}
