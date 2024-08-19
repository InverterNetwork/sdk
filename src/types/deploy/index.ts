import type { DeployReturn } from '../../deploy'

export * from './ERC20Issuance'

export type DeployParamsByKey<K extends keyof DeployReturn> = Parameters<
  DeployReturn[K]
>[0]
