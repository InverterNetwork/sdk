import { PublicClient, WalletClient } from 'viem'
import { encodeAbiParameters } from 'viem'
import { MANDATORY_MODULES, ORCHESTRATOR_CONFIG } from './constants'
import {
  RequestedModule,
  RequestedModules,
  DeploySchema,
  ClientInputs,
  EncodedParams,
  GenericModuleParams,
  FinalArgs,
  OrchestratorArg,
  MandatoryModuleType,
} from './types'
import {
  assembleMetadata,
  getDeploymentConfig,
  getDeployInteraction,
} from './utils'
import { getModuleVersion } from '@inverter-network/abis'
import { getJsType } from '../utils'

// uses the deploymentArgs from the config and transforms them into a flattened
// array as well as injects a value property of type string which is supposed to
// be filled with a user input through the client side
const parseParams = (deploymentArgs: any) => {
  const flattenedParams: any = []

  Object.keys(deploymentArgs).forEach((key) => {
    const params = deploymentArgs[key]
    if (params.length > 0) {
      params.forEach(({ description, name, type }: any) => {
        const jsType = getJsType(type)
        flattenedParams.push({ description, name, type, jsType })
      })
    }
  })
  return flattenedParams
}

const getModuleSchema = (module: RequestedModule) => {
  const { name, version } = module
  // get deployment arg info from configs (abis package)
  const { deploymentArgs: rawModuleConfig } = getDeploymentConfig(name, version)
  const inputs = parseParams(rawModuleConfig)
  const moduleSchema = {
    version,
    inputs,
    name,
  }
  return moduleSchema
}

// based on the module names and versions passed to it
// retrieves from the abi config the required deployment inputs
// for the requested modules
const getInputSchema = (moduleSpecs: RequestedModules) => {
  const inputSchema: any = { orchestrator: ORCHESTRATOR_CONFIG }
  MANDATORY_MODULES.forEach((moduleType) => {
    const moduleSchema = getModuleSchema(
      moduleSpecs[moduleType as keyof typeof moduleSpecs] as RequestedModule
    )
    if (moduleSchema.inputs.length > 0) {
      inputSchema[moduleType] = moduleSchema
    }
  })
  if (moduleSpecs.optionalModules && moduleSpecs.optionalModules.length > 0) {
    moduleSpecs.optionalModules.forEach((m) => {
      const moduleSchema = getModuleSchema(m as RequestedModule)
      if (moduleSchema.inputs.length > 0) {
        if (!inputSchema.optionalModules) {
          inputSchema.optionalModules = []
        }
        inputSchema.optionalModules.push(getModuleSchema(m as RequestedModule))
      }
    })
  }
  return inputSchema as DeploySchema
}

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
  const moduleConfig = getModuleVersion(name, version)
  const { moduleType } = moduleConfig
  const moduleArgs = {
    ...getEncodedParams(clientInputs, moduleConfig),
  } as GenericModuleParams
  moduleArgs.metadata = assembleMetadata(name, version)
  return { moduleType, moduleArgs }
}

const constructArgs = (
  requestedModules: RequestedModules,
  clientInputs: ClientInputs
) => {
  const args = {
    orchestrator: clientInputs.Orchestrator as OrchestratorArg,
    fundingManager: {} as GenericModuleParams,
    authorizer: {} as GenericModuleParams,
    paymentProcessor: {} as GenericModuleParams,
    optionalModules: [] as GenericModuleParams[],
  } as FinalArgs
  // mandatory modules
  ;(MANDATORY_MODULES as MandatoryModuleType[]).forEach((type) => {
    const userChoice = requestedModules[type]
    const { moduleType, moduleArgs } = assembleModuleArgs(
      userChoice,
      clientInputs
    )
    args[moduleType as MandatoryModuleType] = moduleArgs
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

const getArrayifiedArgs = (
  requestedModules: RequestedModules,
  clientInputs: ClientInputs
) => {
  const {
    orchestrator,
    fundingManager,
    authorizer,
    paymentProcessor,
    optionalModules,
  } = constructArgs(requestedModules, clientInputs)

  return [
    orchestrator,
    fundingManager,
    authorizer,
    paymentProcessor,
    optionalModules,
  ] as [
    OrchestratorArg,
    GenericModuleParams,
    GenericModuleParams,
    GenericModuleParams,
    GenericModuleParams[],
  ]
}

export default async function (
  walletClient: WalletClient,
  publicClient: PublicClient,
  requestedModules: RequestedModules
) {
  const inputSchema = getInputSchema(requestedModules)
  const { run, simulate } = getDeployInteraction(walletClient, publicClient)

  const deploy = async (clientInputs: ClientInputs) => {
    const args = getArrayifiedArgs(requestedModules, clientInputs)

    try {
      const { result } = await simulate(args, {} as any)
      const txHash = await run(args, {} as any)
      return { txHash, orchestratorAddress: result }
    } catch (e) {
      console.log(e)
      return e
    }
  }

  const simulateDeploy = async (clientInputs: ClientInputs) => {
    const args = getArrayifiedArgs(requestedModules, clientInputs)
    const { result } = await simulate(args, {} as any)
    return result
  }

  return { inputSchema, deploy, simulateDeploy }
}
