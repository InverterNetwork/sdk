import { WalletClient } from 'viem'
import { encodeAbiParameters, AbiParameter } from 'viem'
import { EMPTY_ENCODED_VAL, ORCHESTRATOR_CONFIG } from './constants'
import {
  ModuleInputs,
  ModuleSpec,
  ModuleType,
  OrchestratorInputs,
  Params,
  UserInputs,
} from './types'
import { assembleMetadata, getDeploymentConfig, getWriteFn } from './utils'

// creates an array of length = 5 to fill in the inputs for the deploy function
const getPrefilledDeploymentArgs = () => {
  const deploymentArgs = {} as any
  deploymentArgs.orchestrator = ORCHESTRATOR_CONFIG
  deploymentArgs.logicModules = [] //optional modules
  return deploymentArgs
}

// uses the deploymentArgs from the config and transforms them into a flattened
// array as well as injects a value property of type string which is supposed to
// be filled with a user input through the client side
const getFlattenedParams = (deploymentArgs: any) => {
  const flattenedParams: any = []

  Object.keys(deploymentArgs).forEach((key) => {
    const params = deploymentArgs[key]
    if (params.length > 0) {
      params.forEach((p: any) => flattenedParams.push({ ...p, jsType: '' }))
    }
  })

  return flattenedParams
}

const getModuleSchema = (module: ModuleSpec) => {
  const { name, version } = module
  // get deployment arg info from configs (abis package)
  const { deploymentArgs: rawModuleConfig, moduleType } = getDeploymentConfig(
    name,
    version
  )
  const params = getFlattenedParams(rawModuleConfig)
  const moduleSchema = {
    name,
    version,
    params,
  }
  return { [moduleType]: moduleSchema }
}

// based on the module names and versions passed to it
// retrieves from the abi config the required deployment inputs
// for the requested modules
const getInputSchema = (modules: ModuleSpec[]) => {
  // get object that holds deployment args prefilled w/ orchestrator config
  let deploymentArgs = getPrefilledDeploymentArgs()
  for (let i = 0; i < modules.length; i++) {
    const moduleConfigInfo = getModuleSchema(modules[i])
    deploymentArgs = { ...deploymentArgs, ...moduleConfigInfo }
  }
  return deploymentArgs
}

// returns the formatted orchestrator params to be passed to the deploy function
const getOrchestratorParams = (orchestrator: OrchestratorInputs) => ({
  owner: orchestrator.params[0],
  token: orchestrator.params[1],
})

// takes in ALL params passed for a given module
// and encodes slices of those params (representing configData & dependencyData)
const encodeUserInputs = (
  params: Params[],
  startIdx: number,
  endIdx: number
) => {
  if (startIdx > params.length) {
    return EMPTY_ENCODED_VAL
  }
  const abiEncoderParams: [AbiParameter[], any] = [[], []]
  params.slice(startIdx, endIdx).forEach(({ name, type, value }) => {
    // TODO
    abiEncoderParams[0].push({ name, type } as any)
    abiEncoderParams[1].push(value)
  })
  return encodeAbiParameters(...abiEncoderParams)
}

// for a given module validates if the module
// and encodes and formats the inputs
const getModuleInputs = <TModuleType extends ModuleType>(
  module: ModuleInputs<TModuleType>
) => {
  const { name, version, params } = module
  const { deploymentArgs } = getDeploymentConfig(name as any, version)
  const { configData, dependencyData } = deploymentArgs
  const encodedConfigData = encodeUserInputs(params, 0, configData.length)
  const encodedDependencyData = encodeUserInputs(
    params,
    configData.length,
    configData.length + dependencyData.length
  )
  const metadata = assembleMetadata(name, version)
  return {
    metadata,
    configData: encodedConfigData,
    dependencyData: encodedDependencyData,
  }
}

// takes in the inputs submitted by a user and parses & encodes
// them into the format requested by the deploy function
const parseInputs = (argsConfig: any) => {
  const {
    orchestrator,
    fundingManager,
    authorizer,
    paymentProcessor,
    logicModules,
  } = argsConfig

  // Orchestrator
  const orchestratorInputs = getOrchestratorParams(orchestrator)

  // Mandatory Modules
  const fundingManagerInputs = getModuleInputs(fundingManager)
  const authorizerInputs = getModuleInputs(authorizer)
  const paymentProcessorInputs = getModuleInputs(paymentProcessor)

  // Optional Modules
  const optionalModuleInputs = logicModules.map((m: any) => getModuleInputs(m))

  return [
    orchestratorInputs,
    fundingManagerInputs,
    authorizerInputs,
    paymentProcessorInputs,
    optionalModuleInputs,
  ]
}

const fillSchema = (clientInputs: any, inputSchema: any) => {
  const filledInputSchema = { ...inputSchema }
  Object.keys(inputSchema).forEach((moduleType) => {
    if (moduleType === 'logicModules') {
      filledInputSchema[moduleType].forEach((_: any, i: any) => {
        filledInputSchema[moduleType][i] = {
          ...filledInputSchema[moduleType][i],
          params: filledInputSchema[moduleType].params.map(
            (param: any, idx: any) => {
              return {
                ...param,
                value: clientInputs[moduleType].params[i][idx],
              }
            }
          ),
        }
      })
    } else {
      filledInputSchema[moduleType] = {
        ...filledInputSchema[moduleType],
        params: filledInputSchema[moduleType].params.map(
          (param: any, idx: any) => {
            return {
              ...param,
              value: clientInputs[moduleType].params[idx],
            }
          }
        ),
      }
    }
  })
  return filledInputSchema
}

export default async function (
  walletClient: WalletClient,
  modules: ModuleSpec[]
) {
  const inputSchema = getInputSchema(modules)

  // get deploy function
  const deployFunction = async (clientInputs: UserInputs) => {
    const filledSchema = fillSchema(clientInputs, inputSchema)
    const parsedInputs = parseInputs(filledSchema)
    const writeFn = getWriteFn(walletClient)
    return writeFn(parsedInputs as any, {} as any)
      .then((r) => r)
      .catch((e) => e)
  }

  return { inputSchema, deployFunction }
}
