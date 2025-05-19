// external dependencies
import type { GetModuleNameByType } from '@inverter-network/abis'
import { data } from '@inverter-network/abis'

/**
 * @description Get the available modules for workflow deployment
 * @template FT - The factory type
 * @param factoryType - The factory type
 * @returns The available modules for workflow deployment
 * @example
 * ```ts
 * const { fundingManager, paymentProcessor, authorizer, optionalModules } = getDeployWorkflowOptions()
 * ```
 */
export function getDeployWorkflowOptions() {
  // Initialize empty arrays for each module type
  const modulesObj = data.reduce(
    (acc, item) => {
      const { moduleType, name } = item

      switch (moduleType) {
        case 'authorizer':
          acc.authorizer.push(name)
          break
        case 'paymentProcessor':
          acc.paymentProcessor.push(name)
          break
        case 'optionalModule':
          acc.optionalModules.push(name)
          break
        case 'fundingManager':
          acc.fundingManager.push(name)
          break
      }

      return acc
    },
    {
      fundingManager: [] as GetModuleNameByType<'fundingManager'>[],
      paymentProcessor: [] as GetModuleNameByType<'paymentProcessor'>[],
      authorizer: [] as GetModuleNameByType<'authorizer'>[],
      optionalModules: [] as GetModuleNameByType<'optionalModule'>[],
    }
  )

  return modulesObj
}
