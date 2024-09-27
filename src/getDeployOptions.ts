import type { FactoryType, FilterByPrefix } from '@'
import { data, type GetModuleNameByType } from '@inverter-network/abis'

export default function getDeployOptions<
  FT extends FactoryType | undefined = undefined,
>(factoryType?: FT) {
  // Default factory type handling
  const definedFactoryType = factoryType ?? 'default'

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
          // Apply prefix filtering if required by the factory type
          if (definedFactoryType === 'default')
            acc.fundingManager.push(name as any)
          else if (name.startsWith('FM_BC'))
            acc.fundingManager.push(name as any)
          break
      }

      return acc
    },
    {
      fundingManager: [] as unknown as FT extends undefined | 'default'
        ? GetModuleNameByType<'fundingManager'>[]
        : FilterByPrefix<GetModuleNameByType<'fundingManager'>, 'FM_BC'>[],
      paymentProcessor: [] as GetModuleNameByType<'paymentProcessor'>[],
      authorizer: [] as GetModuleNameByType<'authorizer'>[],
      optionalModules: [] as GetModuleNameByType<'optionalModule'>[],
    }
  )

  return modulesObj
}
