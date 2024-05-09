import { data } from '@inverter-network/abis'

export default function getDeployOptions() {
  const deployOptions = data
    .map(({ moduleType, name, version }) => {
      switch (moduleType) {
        case 'utils':
        case 'logicModule':
          return { type: 'optioanlModules' as const, name, version }
        case 'authorizer':
        case 'fundingManager':
        case 'paymentProcessor':
          return { type: moduleType, name, version }
        default:
          return null
      }
    })
    .filter((x): x is Exclude<typeof x, null> => x !== null)

  return deployOptions
}
