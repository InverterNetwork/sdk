import { PopPublicClient, PopWalletClient } from './types'
import getWorkflow from './getWorkflow'
import { WorkflowOrientation, Workflow } from './getWorkflow/types'
import { RequestedModules } from './getDeploy/types'
import getDeploy from './getDeploy'

export class InverterSDK {
  readonly publicClient: PopPublicClient
  readonly walletClient: PopWalletClient
  readonly workflows: Map<`0x${string}`, any>
  tokenCache: Map<string, any>

  constructor(publicClient: PopPublicClient, walletClient: PopWalletClient) {
    this.publicClient = publicClient
    this.walletClient = walletClient
    this.workflows = new Map()
    this.tokenCache = new Map()
  }

  async getWorkflow(
    orchestratorAddress: `0x${string}`,
    workflowOrientation?: WorkflowOrientation
  ) {
    const cachedWorkflow = this.workflows.get(orchestratorAddress)
    if (cachedWorkflow) {
      return cachedWorkflow as Workflow<PopWalletClient, WorkflowOrientation>
    } else {
      const workflow = await getWorkflow({
        publicClient: this.publicClient,
        walletClient: this.walletClient,
        orchestratorAddress,
        workflowOrientation,
      })
      this.workflows.set(orchestratorAddress, workflow)
      return workflow as Workflow<PopWalletClient, WorkflowOrientation>
    }
  }

  async getDeploy(requestedModules: RequestedModules) {
    return await getDeploy(
      this.publicClient,
      this.walletClient,
      requestedModules,
      this
    )
  }
}
