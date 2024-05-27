import { getModuleData } from '@inverter-network/abis'
import { PublicClient, encodeAbiParameters } from 'viem'
import { GetDeploymentInputs, PopWalletClient } from '../types'
import { MANDATORY_MODULES } from './constants'
import {
  ConstructedArgs,
  ModuleArgs,
  RequestedModule,
  RequestedModules,
  GetUserArgs,
  UserModuleArg,
  UserArgs,
} from './types'
import { assembleMetadata, getViemMethods } from './utils'
import parseInputs from '../utils/parseInputs'
import { TOKEN_DATA_ABI } from '../utils/constants'

const prepareArgsForEncoding = async (
  configArr,
  userModuleArgs: UserModuleArg
) => {
  const args = Array(configArr.length)
  const formattedInputs = Array(configArr.length)
  for (let i = 0; i < configArr.length; i++) {
    const configDataMember = configArr[i]
    const { name, components } = configDataMember
    if (components) {
      // parse args into object format
      const tupleArgs = components.reduce((acc, item) => {
        acc[item.name] = userModuleArgs[item.name]
        return acc
      }, {})
      args[i] = tupleArgs
    } else {
      const value = userModuleArgs[name]
      args[i] = value
    }
    formattedInputs[i] = configDataMember
  }
  return {
    formattedInputs,
    args,
  }
}

const getEncodedArgs = async (
  deploymentInputs: GetDeploymentInputs,
  publicClient: PublicClient,
  userModuleArgs: UserModuleArg
) => {
  const { formattedInputs, args } = await prepareArgsForEncoding(
    deploymentInputs.configData,
    userModuleArgs
  )

  // TODO: pass formattedInputs and args to parseInputs
  // challenge: parseInputs returns a flat array but viem's
  // encodeAbiParameters expects a different format:
  // https://viem.sh/docs/abi/encodeAbiParameters.html#simple-struct

  // const parsedArgs = await parseInputs({
  //   formattedInputs,
  //   args,
  //   publicClient,
  // })

  // Return encodedArgs
  return {
    configData: encodeAbiParameters(formattedInputs, args),
  }
}

const assembleModuleArgs = async (
  name: RequestedModule,
  publicClient: PublicClient,
  userModuleArgs: UserModuleArg
): Promise<ModuleArgs> => {
  const { deploymentInputs } = getModuleData(name)
  const moduleArgs = {
    ...(await getEncodedArgs(deploymentInputs, publicClient, userModuleArgs)),
    metadata: assembleMetadata(name),
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
          userArgs.optionalModules?.[optionalModule]
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
  walletClient: PopWalletClient,
  requestedModules: T
) {
  const { write, simulateWrite } = getViemMethods(walletClient, publicClient)

  const simulate = async (userArgs: GetUserArgs<T>) => {
    const arr = await getArgs(requestedModules, userArgs, publicClient)
    return await simulateWrite(arr, {
      account: walletClient.account.address,
    })
  }

  const run = async (userArgs: GetUserArgs<T>) => {
    const arr = await getArgs(requestedModules, userArgs, publicClient)
    // Return the write function with the args
    return (async () => {
      // prettier-ignore
      const orchestratorAddress = (await simulateWrite(arr, {
        account: walletClient.account.address,
      })).result
      const transactionHash = await write(arr, {} as any)

      return {
        orchestratorAddress,
        transactionHash,
      }
    })()
  }

  return { run, simulate }
}
