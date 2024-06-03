import { getModuleData } from '@inverter-network/abis'
import { PublicClient, encodeAbiParameters } from 'viem'
import { Extras, GetDeploymentInputs, PopWalletClient } from '../types'
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
import { InverterSDK } from '../InverterSDK'
import { TOKEN_DATA_ABI } from '../utils/constants'

export default async <T extends RequestedModules>(
  publicClient: PublicClient,
  walletClient: PopWalletClient,
  requestedModules: T,
  self?: InverterSDK
) => {
  let extras: Extras

  const getEncodedArgs = async (
    { configData }: GetDeploymentInputs,
    userModuleArg?: UserModuleArg
  ) => {
    const formattedInputs = formatParameters(configData)

    const args = userModuleArg ? getValues(userModuleArg) : '0x00'

    // MG NOTE: Parse inputs respects the array order and struct structure

    const { inputsWithDecimals } = (await parseInputs({
      formattedInputs,
      args,
      publicClient,
      walletClient,
      self,
      extras,
    })) as any

    // Return encodedArgs
    return encodeAbiParameters(configData, inputsWithDecimals)
  }

  const assembleModuleArgs = async (
    name: RequestedModule,
    userModuleArgs?: UserModuleArg
  ): Promise<ModuleArgs> => {
    const { deploymentInputs } = getModuleData(name)

    const encodedArgs = await getEncodedArgs(deploymentInputs, userModuleArgs)

    const moduleArgs = {
      configData: encodedArgs,
      metadata: assembleMetadata(name),
    }

    return moduleArgs
  }

  const getDefaultToken = async (fundingManager: UserModuleArg) => {
    const { readContract } = publicClient

    let tokenAddress: `0x${string}`
    if (fundingManager['acceptedToken']) {
      tokenAddress = fundingManager['acceptedToken'] as `0x${string}`
    } else if (fundingManager['orchestratorTokenAddress']) {
      tokenAddress = fundingManager['orchestratorTokenAddress'] as `0x${string}`
    }

    const decimals = <number>await readContract({
      address: tokenAddress!,
      functionName: 'decimals',
      abi: TOKEN_DATA_ABI,
    })
    return { defaultToken: tokenAddress!, decimals }
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

    if (userArgs.fundingManager) {
      extras = await getDefaultToken(userArgs!.fundingManager)
    }

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
        optionalModules.map((optionalModule) => {
          const userModuleArg = userArgs.optionalModules?.[optionalModule]
          return assembleModuleArgs(optionalModule, userModuleArg)
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
    userArgs: GetUserArgs<T>
  ) {
    const constructed = await constructArgs(requestedModules, userArgs)

    return [
      constructed.orchestrator,
      constructed.fundingManager,
      constructed.authorizer,
      constructed.paymentProcessor,
      constructed.optionalModules,
    ] as const
  }

  async function getRpcInteractions<T extends RequestedModules>(
    requestedModules: T
  ) {
    const { write, simulateWrite } = await getViemMethods(
      walletClient,
      publicClient
    )

    const simulate = async (userArgs: GetUserArgs<T>) => {
      const arr = await getArgs(requestedModules, userArgs)

      return await simulateWrite(arr, {
        account: walletClient.account.address,
      })
    }

    const run = async (userArgs: GetUserArgs<T>) => {
      const arr = await getArgs(requestedModules, userArgs)
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

  return await getRpcInteractions(requestedModules)
}
