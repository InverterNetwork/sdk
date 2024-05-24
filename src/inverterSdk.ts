import {
  UserFacingModuleType,
  GetModuleNameByType,
} from '@inverter-network/abis'
import { Merge } from 'type-fest-4'

import getWorkflow from './getWorkflow'
import { PopPublicClient, PopWalletClient } from './types'

type OrientationPart<
  MT extends UserFacingModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = N

type WorkflowOrientation = Merge<
  {
    [T in Exclude<UserFacingModuleType, 'logicModule'>]: OrientationPart<T>
  },
  {
    logicModules?: OrientationPart<'logicModule'>[]
  }
>

export class InverterSDK {
  readonly publicClient: PopPublicClient
  readonly walletClient: PopWalletClient
  workflows: Map<`0x${string}`, WorkflowOrientation>

  constructor(publicClient: PopPublicClient, walletClient: PopWalletClient) {
    this.publicClient = publicClient
    this.walletClient = walletClient
    this.workflows = new Map()
  }

  async addWorkflow<O extends WorkflowOrientation | undefined = undefined>(
    orchestratorAddress: `0x${string}`,
    workflowOrientation?: O
  ) {
    const workflow = await getWorkflow({
      publicClient: this.publicClient,
      walletClient: this.walletClient,
      orchestratorAddress: orchestratorAddress,
      workflowOrientation,
    })
    this.workflows.set(orchestratorAddress, workflow)
  }

  getWorkflow(orchestratorAddress: `0x${string}`) {
    return this.workflows.get(orchestratorAddress)
  }
}
