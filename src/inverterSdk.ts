import { PopPublicClient, PopWalletClient } from './types'
import getWorkflow from './getWorkflow'
import { WorkflowOrientation, Workflow } from './getWorkflow/types'
import { RequestedModules } from './getDeploy/types'
import getDeploy from './getDeploy'

export class InverterSDK {
  readonly publicClient: PopPublicClient
  readonly walletClient: PopWalletClient
  readonly workflows: Map<`0x${string}`, any>

  constructor(publicClient: PopPublicClient, walletClient: PopWalletClient) {
    this.publicClient = publicClient
    this.walletClient = walletClient
    this.workflows = new Map()
  }

  async addWorkflow(
    orchestratorAddress: `0x${string}`,
    workflowOrientation?: WorkflowOrientation
  ) {
    const workflow = await getWorkflow({
      publicClient: this.publicClient,
      walletClient: this.walletClient,
      orchestratorAddress,
      workflowOrientation,
    })
    this.workflows.set(orchestratorAddress, workflow)
  }

  getWorkflow<O extends WorkflowOrientation>(
    orchestratorAddress: `0x${string}`
  ) {
    const workflow = this.workflows.get(orchestratorAddress)
    return workflow as Workflow<PopWalletClient, O>
  }

  async getDeploy(requestedModules: RequestedModules) {
    return await getDeploy(
      this.publicClient,
      this.walletClient,
      requestedModules
    )
  }
}
