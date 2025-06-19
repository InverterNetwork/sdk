import type { GetModuleData, ModuleName } from '@inverter-network/abis'
import { getModuleData } from '@inverter-network/abis'
import type { FilterBySuffix } from '@/index'
import type { ExtractAbiFunctionNames } from 'abitype'
import { toFunctionSelector } from 'viem'

// TYPES
// ------------------------------------------------------------

/**
 * @description Module names which are compatible with the Autorizer v2
 */
export type AutV2ModuleName = FilterBySuffix<ModuleName, '_v2' | '_v3'>

type FunctionSelector<TModuleName extends AutV2ModuleName> = {
  selector: `0x${string}`
  name: ExtractAbiFunctionNames<GetModuleData<TModuleName>['abi']>
}

/**
 * @description Private role for the Autorizer v2
 * @template TModuleName - The module name
 * @property name - The name of the role
 * @property adminRole - The admin role
 * @property members - The members of the role
 * @property functions - The functions of the role
 * @returns The private role
 */
export type AutorizerPrivateRole<TModuleName extends AutV2ModuleName> = {
  name: string
  adminRole: `0x${string}`
  members: `0x${string}`[]
  functions: FunctionSelector<TModuleName>[]
}

/**
 * @description The Autorizer template config
 * @template TModuleName - The module name
 * @property name - The name of the template
 * @property module - The module name
 * @property roles - The roles of the template
 * @property publicFunctions - The public functions of the template
 */
export type AutorizeTemplateConfig<TModuleName extends AutV2ModuleName> = {
  name: string
  module: TModuleName
  roles: Array<{
    name: string
    adminRole: `0x${string}`
    functions: ExtractAbiFunctionNames<GetModuleData<TModuleName>['abi']>[]
    members?: `0x${string}`[]
  }>
  publicFunctions?: ExtractAbiFunctionNames<GetModuleData<TModuleName>['abi']>[]
}

/**
 * @description Return type for creating an Autorizer template
 * @template TModuleName - The module name
 * @property name - The name of the template
 * @property module - The module name
 * @property roles - The roles of the template
 * @property publicRoles - The public functions of the template
 * @returns The Autorizer template
 */
export type CreateAutorizerTemplateReturnType<
  TModuleName extends AutV2ModuleName,
> = {
  name: string
  module: TModuleName
  roles: AutorizerPrivateRole<TModuleName>[]
  publicRoles: FunctionSelector<TModuleName>[]
}

// CONSTANTS
// ------------------------------------------------------------

const SUPER_ADMIN = '0x0000000000000000000000000000000000000000' as const

// HELPERS
// ------------------------------------------------------------

/**
 * @description Creates a function selector for an Autorizer template
 * @template TModuleName - The module name
 * @param moduleName - The name of the module
 * @param functionName - The name of the function
 * @returns The function selector
 */
const getFunctionSelector = <TModuleName extends AutV2ModuleName>(
  moduleName: TModuleName,
  functionName: ExtractAbiFunctionNames<GetModuleData<TModuleName>['abi']>
): FunctionSelector<TModuleName> => {
  const moduleData = getModuleData(moduleName)

  if (!('abi' in moduleData)) throw new Error(`Module ${moduleName} has no abi`)

  const abi = moduleData.abi

  const func = abi.find(
    (f): f is any => f.type === 'function' && f.name === functionName
  )

  if (!func)
    throw new Error(`Function ${functionName} not found in ${moduleName}`)

  return {
    selector: toFunctionSelector(func),
    name: functionName,
  }
}

/**
 * @description Creates an Autorizer template to be used in a deployment
 * @template TModuleName - The module name
 * @param config - The configuration for the template
 * @returns The Autorizer template
 */
const createAutorizerTemplate = <TModuleName extends AutV2ModuleName>(
  config: AutorizeTemplateConfig<TModuleName>
): CreateAutorizerTemplateReturnType<TModuleName> => ({
  name: config.name,
  module: config.module,
  roles: config.roles.map((role) => ({
    name: role.name,
    adminRole: role.adminRole,
    members: role.members || [],
    functions: role.functions.map((f) => getFunctionSelector(config.module, f)),
  })),
  publicRoles:
    config.publicFunctions?.map((f) => getFunctionSelector(config.module, f)) ||
    [],
})

// TEMPLATES
// ------------------------------------------------------------

const templates = [
  createAutorizerTemplate({
    name: 'Simple Bounty Template',
    module: 'LM_PC_Bounties_v2',
    roles: [
      {
        name: 'BOUNTY_MANAGER',
        adminRole: SUPER_ADMIN,
        functions: ['addBounty'],
      },
    ],
    publicFunctions: ['addClaim'],
  }),
] as const

// OUTPUT
// ------------------------------------------------------------

console.log(JSON.stringify(templates, null, 2))
