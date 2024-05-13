import { data } from '@inverter-network/abis'

export default function getDeployOptions() {
  const modules = data
    .map(({ moduleType, name }) => {
      switch (moduleType) {
        case 'authorizer':
          return { moduleType, name }
        case 'fundingManager':
          return { moduleType, name }
        case 'paymentProcessor':
          return { moduleType, name }
        case 'logicModule':
          return { moduleType: 'optionalModules' as const, name }
        default:
          return false
      }
    })
    .filter((x): x is Exclude<typeof x, false> => x !== false)

  type MM = (typeof modules)[number]

  const modulesObj = modules.reduce(
    (result, { moduleType, name }) => {
      ;(result[moduleType] as any).push(name)
      return result
    },
    {
      fundingManager: [],
      paymentProcessor: [],
      authorizer: [],
      optionalModules: [],
    } as {
      [K in MM['moduleType']]: Extract<MM, { moduleType: K }>['name'][]
    }
  )
  return modulesObj
}
