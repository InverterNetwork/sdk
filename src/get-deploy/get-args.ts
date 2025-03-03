import { getModuleData } from '@inverter-network/abis'
import { processInputs, ADDRESS_ZERO } from '@/utils'
import { MANDATORY_MODULES } from './constants'
import { assembleMetadata, getDefaultToken } from './utils'
import { Inverter } from '@/inverter'

import { encodeAbiParameters, parseUnits } from 'viem'
import type { PublicClient } from 'viem'
import type {
  Extras,
  GetModuleDeploymentInputs,
  PopWalletClient,
  ConstructedArgs,
  ModuleArgs,
  RequestedModule,
  RequestedModules,
  GetUserArgs,
  UserModuleArg,
  UserArgs,
  DeployMethodKind,
  FactoryType,
  TagOverwrites,
} from '@/types'

import d from 'debug'

const debug = d('inverter:sdk:get-args')

let extras: Extras

/**
 * @description The shared parameters for the getArgs function and its utils
 */
export type GetDeployGetArgsSharedParams = {
  publicClient: PublicClient
  walletClient: PopWalletClient
  kind: DeployMethodKind
  self?: Inverter
  tagOverwrites?: TagOverwrites
}

/**
 * Encodes arguments for a module based on configuration data and user-provided arguments.
 */
export const getEncodedArgs = async ({
  deploymentInputs,
  userModuleArg,
  ...params
}: {
  deploymentInputs: GetModuleDeploymentInputs
  userModuleArg?: UserModuleArg
} & GetDeployGetArgsSharedParams): Promise<`0x${string}`> => {
  // Get the configuration data for the module
  const { configData } = deploymentInputs
  // Itterate through the formatted inputs and get the user provided arguments
  const args = userModuleArg
    ? configData.map((input) => userModuleArg?.[input.name])
    : '0x00'
  // Process the inputs

  debug('pre processInputs args', args)

  const { processedInputs } = <any>await processInputs({
    extendedInputs: configData,
    args,
    extras,
    ...params,
  })

  debug('processedInputs', processedInputs)

  // Encode the processed inputs
  const encodedArgs = encodeAbiParameters(configData, processedInputs)
  // Return the encoded arguments
  return encodedArgs
}

export const assembleModuleArgs = async ({
  name,
  ...params
}: {
  name: RequestedModule
  userModuleArg?: UserModuleArg
} & GetDeployGetArgsSharedParams): Promise<ModuleArgs> => {
  // Get the deployment inputs for the module
  const { deploymentInputs } = getModuleData(name)
  // Get the encoded arguments for the module = encoded configData
  const configData = await getEncodedArgs({
    deploymentInputs,
    ...params,
  })
  // Assempble the metadata for the module
  const metadata = assembleMetadata(name)
  // Return the module arguments
  return {
    configData,
    metadata,
  }
}

/**
 * Constructs the arguments required for the requested modules.
 */
export const constructArgs = async ({
  requestedModules,
  userArgs,
  factoryType,
  ...rest
}: {
  factoryType: FactoryType
  requestedModules: RequestedModules
  userArgs: UserArgs
} & GetDeployGetArgsSharedParams) => {
  let orchestrator = userArgs?.orchestrator
  // If orchestrator is not provided, set it to default values
  if (!orchestrator?.independentUpdates)
    orchestrator = {
      independentUpdates: false,
      independentUpdateAdmin: ADDRESS_ZERO,
    }

  // Set up the initial arguments
  const args = {
    orchestrator,
    fundingManager: {},
    authorizer: {},
    paymentProcessor: {},
    optionalModules: [],
    issuanceToken: {},
    initialPurchaseAmount: '',
    beneficiary: {},
    migrationConfig: {},
  } as unknown as ConstructedArgs

  // Get the default token if the funding manager is provided
  if (userArgs.fundingManager)
    extras = await getDefaultToken(rest.publicClient, userArgs.fundingManager)

  // if the factory type is restricted-pim or immutable-pim, define the issuance token decimals
  const issuanceTokenDecimals = userArgs?.issuanceToken?.decimals

  // Get the arguments for the mandatory modules
  let mendatoryModuleIdx = 0
  for (const moduleType of MANDATORY_MODULES) {
    if (
      moduleType === 'fundingManager' &&
      requestedModules.fundingManager.startsWith('FM_BC') &&
      factoryType !== 'default'
    ) {
      userArgs.fundingManager!.issuanceToken = ADDRESS_ZERO
    }

    const argObj = await assembleModuleArgs({
      name: requestedModules[moduleType],
      userModuleArg: userArgs[moduleType],
      tagOverwrites: { issuanceTokenDecimals },
      ...rest,
    })
    args[MANDATORY_MODULES[mendatoryModuleIdx]] = argObj
    mendatoryModuleIdx++
  }

  // spread to the optional modules
  const { optionalModules } = requestedModules

  // If optional modules are provided, get the arguments for them
  if (optionalModules && optionalModules.length > 0) {
    // Get the arguments for the optional
    for (const optionalModule of optionalModules) {
      const argObj = await assembleModuleArgs({
        name: optionalModule,
        userModuleArg: userArgs.optionalModules?.[optionalModule],
        ...rest,
      })
      // Assign the optional module arguments to the args object
      args.optionalModules.push(argObj)
    }
  }

  switch (factoryType) {
    case 'restricted-pim':
    case 'immutable-pim':
    case 'migrating-pim':
      if (!userArgs.issuanceToken) throw new Error('Issuance token is required')

      // In either case, the issuance token is required
      args.issuanceToken = {
        ...userArgs.issuanceToken,
        maxSupply: String(
          parseUnits(
            userArgs.issuanceToken.maxSupply,
            Number(issuanceTokenDecimals)
          )
        ),
      }

      // If the factory type is restricted-pim, the beneficiary is parsed if provided
      if (factoryType === 'restricted-pim' && !!userArgs.beneficiary) {
        args.beneficiary = userArgs.beneficiary
      }

      // If the factory type is immutable-pim, the initial purchase amount is parsed if provided
      if (
        ['immutable-pim', 'migrating-pim'].includes(factoryType) &&
        !!userArgs.initialPurchaseAmount
      ) {
        args.initialPurchaseAmount = String(
          parseUnits(
            userArgs.initialPurchaseAmount,
            Number(issuanceTokenDecimals)
          )
        )
      }

      if (factoryType === 'migrating-pim' && !!userArgs.migrationConfig) {
        args.migrationConfig = {
          ...userArgs.migrationConfig,
          migrationThreshold: String(
            parseUnits(
              userArgs.migrationConfig.migrationThreshold,
              Number(extras.decimals)
            )
          ),
        }
      }
      break
  }

  return args
}

/**
 * Retrieves the arguments required for the requested modules.
 */
export default async function getArgs<
  T extends RequestedModules,
  FT extends FactoryType,
>(
  params: {
    requestedModules: T
    factoryType: FT
    userArgs: GetUserArgs<T, FT>
  } & GetDeployGetArgsSharedParams
) {
  // Construct the arguments in a object
  const constructed = await constructArgs(params)
  // Return the arguments as an array
  const baseArr = [
    constructed.orchestrator,
    constructed.fundingManager,
    constructed.authorizer,
    constructed.paymentProcessor,
    constructed.optionalModules,
  ] as const

  const withRestrictedPim = [
    ...baseArr,
    constructed.issuanceToken,
    constructed.beneficiary,
  ] as const

  const withImmutablePim = [
    ...baseArr,
    constructed.issuanceToken,
    constructed.initialPurchaseAmount,
  ] as const

  const withMigratingPim = [
    ...baseArr,
    constructed.issuanceToken,
    constructed.initialPurchaseAmount,
    constructed.migrationConfig,
  ] as const

  const result = {
    'restricted-pim': withRestrictedPim,
    'immutable-pim': withImmutablePim,
    'migrating-pim': withMigratingPim,
    default: baseArr,
  }[params.factoryType]

  return result
}
