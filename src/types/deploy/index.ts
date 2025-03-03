import type { BaseData } from '@inverter-network/abis'

/**
 * @description Deployable contracts
 */
export type DeployableContracts = Extract<
  BaseData[number],
  { deploymentInputs: { bytecode: string } }
>['name']
