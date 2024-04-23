import { getContract, WalletClient } from 'viem'
import { encodeAbiParameters, TypedData, AbiParameter } from 'viem'
import {
  data,
  getModuleVersion,
  UserFacingModuleType,
  ModuleVersion,
  ModuleVersionKey,
} from '@inverter-network/abis'
import { Pretty } from './types'

// ========HARDCODED CONFIGS========
const ORCHESTRATOR_CONFIG = {
  name: 'Orchestrator',
  version: 'v1.0',
  params: [
    {
      name: 'owner',
      type: 'string',
      description: 'The owner address of the workflow',
      value: '',
    },
    {
      name: 'token',
      type: 'string',
      description: 'The payment token associated with the workflow',
      value: '',
    },
  ],
}
const MANDATORY_MODULES = 3
const OPTIONAL_MODULES_IDX = 4
const EMPTY_ENCODED_VAL = '0x'
const ORCHESTRATOR_FACTORY_ADDRESS =
  '0x690d5000D278f90B167354975d019c747B78032e'
const METADATA_URL = 'https://github.com/InverterNetwork'
// =================================

type ModuleType = Exclude<UserFacingModuleType, 'orchestrator'>

type NameByModuleType<T extends ModuleType> = Extract<
  ModuleVersion,
  { moduleType: T }
>['name']

type ModuleInputs<T extends ModuleType> = {
  name: NameByModuleType<T>
  version: ModuleVersionKey
  params: Params[]
}

type GenericModuleNames = NameByModuleType<ModuleType>

type GenericModuleInputs = ModuleInputs<ModuleType>

type OrchestratorInputs = typeof ORCHESTRATOR_CONFIG

type UserInputs = [
  OrchestratorInputs,
  ModuleInputs<'fundingManager'>,
  ModuleInputs<'authorizer'>,
  ModuleInputs<'paymentProcessor'>,
  ModuleInputs<'logicModule'>[],
]

type ModuleSpec = {
  name: Pretty<
    | NameByModuleType<'fundingManager'>
    | NameByModuleType<'authorizer'>
    | NameByModuleType<'paymentProcessor'>
    | NameByModuleType<'logicModule'>
  >
  version: ModuleVersionKey
}

type Params = {
  name: string
  type: TypedData
  description: string
  value: string
}

// creates an array of length = 5 to fill in the inputs for the deploy function
const getPrefilledDeploymentArgs = () => {
  const deploymentArgs = Array(4)
  deploymentArgs[0] = ORCHESTRATOR_CONFIG
  deploymentArgs[4] = [] //optional modules
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
      params.forEach((p: any) => flattenedParams.push(p))
    }
  })
  const withInjectedValues = flattenedParams.map((p: any) => ({
    ...p,
    value: '',
  }))

  return withInjectedValues
}

const getDeploymentArgs = (
  name: GenericModuleNames,
  version: ModuleVersionKey
) => data[name][version].deploymentArgs

const getModuleSchema = (module: ModuleSpec) => {
  const { name, version } = module
  // get deployment arg info from configs (abis package)
  const rawModuleConfig = getDeploymentArgs(name, version)
  const params = getFlattenedParams(rawModuleConfig)
  const moduleSchema = {
    name,
    version,
    params,
  }
  return moduleSchema
}

// based on the module names and versions passed to it
// retrieves from the abi config the required deployment inputs
// for the requested modules
const getInputSchema = (modules: ModuleSpec[]) => {
  // get array that holds deployment args prefilled w/ orchestrator config
  const deploymentArgs = getPrefilledDeploymentArgs()
  // iterate over modules
  for (let i = 0; i < modules.length; i++) {
    const moduleConfigInfo = getModuleSchema(modules[i])
    if (i <= MANDATORY_MODULES) {
      deploymentArgs[i + 1] = moduleConfigInfo
    } else {
      // if it's an optional module store it in the array at idx = 4
      // of the input params for the deploy function
      deploymentArgs[OPTIONAL_MODULES_IDX].push(moduleConfigInfo)
    }
  }

  return deploymentArgs
}

// validates that modules are passed correctly:
// 1. FundingManager, 2. Authorizer, 3. PaymentProcessor, 4. Array of logic modules
const validateModule = (
  moduleName: GenericModuleNames,
  moduleType: ModuleType
) => {
  const actualModuleType = data[moduleName]['v1.0'].moduleType
  if (actualModuleType !== moduleType) {
    throw Error(
      `Invalid module type: expected ${moduleType} but received ${moduleName} which is of type ${actualModuleType}`
    )
  }
}

const extractMajorMinorVersion = (versionString: ModuleVersionKey) => {
  const version = versionString
    .substring(1)
    .split('.')
    .map((v) => parseInt(v))
  return { majorVersion: version[0], minorVersion: version[1] }
}

// returns the MetaData struct that the deploy function requires for each module
const assembleMetadata = (
  name: GenericModuleNames,
  version: ModuleVersionKey
) => {
  const majorMinorVersion = extractMajorMinorVersion(version)
  return {
    title: name,
    METADATA_URL,
    ...majorMinorVersion,
  }
}

// returns the formatted orchestrator params to be passed to the deploy function
const getOrchestratorParams = (orchestrator: OrchestratorInputs) => ({
  owner: orchestrator.params[0].value,
  token: orchestrator.params[1].value,
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
// is of moduleType (necessary for validation of mandatory modules)
// and encodes and formats the inputs
const getModuleInputs = (
  module: GenericModuleInputs,
  moduleType: ModuleType
) => {
  validateModule(module.name, moduleType)
  const { name, version, params } = module
  const moduleConfigTemplate = getDeploymentArgs(name, version)
  const { configData, dependencyData } = moduleConfigTemplate
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
const parseInputs = (argsConfig: UserInputs) => {
  const [
    orchestrator,
    fundingManager,
    authorizer,
    paymentProcessor,
    optionalModules,
  ] = argsConfig

  // Orchestrator
  const orchestratorInputs = getOrchestratorParams(orchestrator)

  // Mandatory Modules
  const fundingManagerInputs = getModuleInputs(fundingManager, 'fundingManager')
  const authorizerInputs = getModuleInputs(authorizer, 'authorizer')
  const paymentProcessorInputs = getModuleInputs(
    paymentProcessor,
    'paymentProcessor'
  )

  // Optional Modules
  const optionalModuleInputs = optionalModules.map((m) =>
    getModuleInputs(m, 'logicModule')
  )

  return [
    orchestratorInputs,
    fundingManagerInputs,
    authorizerInputs,
    paymentProcessorInputs,
    optionalModuleInputs,
  ]
}

// retrieves the deployment function via viem
const getWriteFn = (walletClient: WalletClient) => {
  const { abi } = getModuleVersion('OrchestratorFactory', 'v1.0')
  const orchestratorFactory = getContract({
    address: ORCHESTRATOR_FACTORY_ADDRESS,
    abi: abi,
    client: {
      wallet: walletClient,
    },
  })

  return orchestratorFactory.write.createOrchestrator
}

export default async function (
  walletClient: WalletClient,
  modules: ModuleSpec[]
) {
  const inputSchema = getInputSchema(modules)

  // get deploy function
  const deployFunction = async (clientInputs: UserInputs) => {
    const parsedInputs = parseInputs(clientInputs)
    const writeFn = getWriteFn(walletClient)
    return writeFn(parsedInputs as any, {} as any)
      .then((r) => r)
      .catch((e) => e)
  }

  return { inputSchema, deployFunction }
}
