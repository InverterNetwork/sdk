import type {
  AuthorizerTemplateConfig,
  AutV2ModuleName,
  DefineAuthorizerTemplateReturnType,
} from '@inverter-network/abis'

import { getFunctionSelector } from '..'

/**
 * @description Defines an Autorizer template to be used in a deployment
 * @template TModuleName - The module name
 * @param config - The configuration for the template
 * @returns The Autorizer template
 */
export const defineAuthorizerTemplate = <TModuleName extends AutV2ModuleName>(
  config: AuthorizerTemplateConfig<TModuleName>
): DefineAuthorizerTemplateReturnType<TModuleName> => ({
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
