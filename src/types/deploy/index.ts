import type { BaseData } from '@inverter-network/abis'

export type DeployableContracts = Extract<
  BaseData[number],
  { deploymentInputs: { bytecode: string } }
>['name']
