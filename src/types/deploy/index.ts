import type { DeployReturn } from '@/deploy'

export * from './ERC20Issuance'

export type DeployKeys = keyof DeployReturn

export type DeployParamsByKey<K extends DeployKeys> = Parameters<
  DeployReturn[K]
>[0]

export type DeployReturnByKey<K extends DeployKeys> = ReturnType<
  DeployReturn[K]
>
