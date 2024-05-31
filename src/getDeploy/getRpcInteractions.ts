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
import formatParameters from '../utils/formatParameters'
import { getValues } from '../utils'
// import { TOKEN_DATA_ABI } from '../utils/constants'

const getEncodedArgs = async (
  { configData }: GetDeploymentInputs,
  publicClient: PublicClient,
  userModuleArg?: UserModuleArg
) => {
  const formattedInputs = formatParameters(configData)

  const args = userModuleArg ? getValues(userModuleArg) : '0x00'

  // MG NOTE: Parse inputs respects the array order and struct structure

  const { inputsWithDecimals } = (await parseInputs({
    formattedInputs,
    args,
    publicClient,
  })) as any

  // Return encodedArgs
  return encodeAbiParameters(configData, inputsWithDecimals)
}

const assembleModuleArgs = async (
  name: RequestedModule,
  publicClient: PublicClient,
  userModuleArgs?: UserModuleArg
): Promise<ModuleArgs> => {
  const { deploymentInputs } = getModuleData(name)

  const encodedArgs = await getEncodedArgs(
    deploymentInputs,
    publicClient,
    userModuleArgs
  )

  const moduleArgs = {
    configData: encodedArgs,
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
      optionalModules.map((optionalModule) => {
        const userModuleArg = userArgs.optionalModules?.[optionalModule]
        return assembleModuleArgs(optionalModule, publicClient, userModuleArg)
      })
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
  const constructed = await constructArgs(
    requestedModules,
    userArgs,
    publicClient
  )

  return [
    constructed.orchestrator,
    constructed.fundingManager,
    constructed.authorizer,
    constructed.paymentProcessor,
    constructed.optionalModules,
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
