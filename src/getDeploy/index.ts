import { WalletClient } from 'viem'
import { encodeAbiParameters } from 'viem'
import { ORCHESTRATOR_CONFIG } from './constants'
import { ModuleSpec, UserInputs } from './types'
import { assembleMetadata, getDeploymentConfig, getWriteFn } from './utils'
import { getModuleVersion } from '@inverter-network/abis'

// creates an array of length = 5 to fill in the inputs for the deploy function
const getPrefilledDeploymentArgs = () => {
  const deploymentArgs = {} as any
  deploymentArgs.orchestrator = ORCHESTRATOR_CONFIG
  deploymentArgs.optionalModules = [] //optional modules
  return deploymentArgs
}

// uses the deploymentArgs from the config and transforms them into a flattened
// array as well as injects a value property of type string which is supposed to
// be filled with a user input through the client side
const flattenParams = (deploymentArgs: any) => {
  const flattenedParams: any = {}

  Object.keys(deploymentArgs).forEach((key) => {
    const params = deploymentArgs[key]
    if (params.length > 0) {
      params.forEach(({ ...p }: any) => {
        const name = p.name
        delete p.name
        flattenedParams[name] = { ...p }
      })
    }
  })
  return flattenedParams
}

const getJsType = (type: any) => {
  if (['bytes32', 'string', 'address'].includes(type)) {
    return 'string'
  } else if (
    [
      'uint',
      'uint256',
      'uint128',
      'uint64',
      'uint32',
      'uint16',
      'uint8',
      'int256',
      'int128',
      'int64',
      'int32',
      'int16',
      'int8',
    ].includes(type)
  ) {
    return 'number'
  } else if (['string[], address[], bytes32[]'].includes(type)) {
    return 'string[]'
  }
}

const injectJsTypes = ({ ...params }: any) => {
  for (const name in params) {
    const { type } = params[name]
    const jsType = getJsType(type)
    params[name] = { ...params[name], jsType }
  }
  return params
}

const getModuleSchema = (module: ModuleSpec) => {
  const { name, version } = module
  // get deployment arg info from configs (abis package)
  const { deploymentArgs: rawModuleConfig, moduleType } = getDeploymentConfig(
    name,
    version
  )
  const params = flattenParams(rawModuleConfig)
  const jsParams = injectJsTypes(params)
  const moduleSchema = {
    name,
    version,
    params: jsParams,
  }
  return { moduleType, moduleSchema }
}

// based on the module names and versions passed to it
// retrieves from the abi config the required deployment inputs
// for the requested modules
const getInputSchema = (modules: ModuleSpec[]) => {
  // get object that holds deployment args prefilled w/ orchestrator config
  let deploymentArgs = getPrefilledDeploymentArgs()
  for (let i = 0; i < modules.length; i++) {
    const { moduleType, moduleSchema } = getModuleSchema(modules[i])
    // don't add module to schema if it doesn't require any user inputs
    if (Object.keys(moduleSchema.params).length === 0) continue
    if (['utils', 'logicModule'].includes(moduleType)) {
      deploymentArgs.optionalModules.push(moduleSchema)
    } else {
      deploymentArgs = { ...deploymentArgs, [moduleType]: moduleSchema }
    }
  }
  // remove optionalModules from schema if there are no modules requested
  // (or if the ones requested don't require any user inputs)
  if (deploymentArgs.optionalModules.length === 0) {
    delete deploymentArgs.optionalModules
  }
  return deploymentArgs
}

const getEncodedParams = (clientInputs: any, moduleConfig: any) => {
  const encodedModuleParams = {}
  const { moduleType, deploymentArgs } = moduleConfig
  const userModuleParams = clientInputs[moduleType]
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
  return encodedModuleParams
}

const constructArgs = (modules: any, clientInputs: any) => {
  const args = { Orchestrator: clientInputs.orchestrator, optionalModules: [] }
  // removing orchestrator makes the rest easier because all other
  // clientInputs can assumed to be models then
  delete clientInputs.orchestrator
  modules.forEach(({ name, version }: any) => {
    const moduleConfig = getModuleVersion(name, version)
    const { moduleType } = moduleConfig
    const moduleArgs = { ...getEncodedParams(clientInputs, moduleConfig) }
    moduleArgs.metadata = assembleMetadata(name, version)
    if (['logicModule', 'util'].includes(moduleType)) {
      args.optionalModules.push(moduleArgs)
    } else {
      args[moduleType] = moduleArgs
    }
  })
  return args
}

export default async function (
  walletClient: WalletClient,
  modules: ModuleSpec[]
) {
  const inputSchema = getInputSchema(modules)

  const deployFunction = async (clientInputs: UserInputs) => {
    // const {
    //   orchestrator,
    //   fundingManager,
    //   authorizer,
    //   paymentProcessor,
    //   optionalModules,
    // } = constructArgs(ARGS_TEMPLATE, modules, clientInputs)
    const args = constructArgs(modules, clientInputs)
    console.log(args)
    // const writeFn = getWriteFn(walletClient)
    // return writeFn(
    //   [
    //     orchestrator,
    //     fundingManager,
    //     authorizer,
    //     paymentProcessor,
    //     optionalModules,
    //   ],
    //   {} as any
    // )
    //   .then((r) => r)
    //   .catch((e) => e)
  }

  return { inputSchema, deployFunction }
}