import getWorkflow from './getWorkflow'
import getDeploy from './getDeploy'
import getDeployOptions from './getDeployOptions'

import type {
  PopPublicClient,
  PopWalletClient,
  WorkflowOrientation,
  Workflow,
  RequestedModules,
  FactoryType,
} from './types'

export class Inverter<W extends PopWalletClient | undefined = undefined> {
  readonly publicClient: PopPublicClient
  readonly walletClient: W
  readonly workflows: Map<`0x${string}`, any>
  tokenCache: Map<string, any>

  constructor(publicClient: PopPublicClient, walletClient?: W) {
    this.publicClient = publicClient
    this.walletClient = walletClient as W
    this.workflows = new Map()
    this.tokenCache = new Map()
  }

  async getWorkflow<T extends WorkflowOrientation | undefined = undefined>(
    orchestratorAddress: `0x${string}`,
    workflowOrientation?: T
  ): Promise<Workflow<W, T>> {
    const cachedWorkflow = this.workflows.get(orchestratorAddress)
    if (cachedWorkflow) return cachedWorkflow
    else {
      const workflow = await getWorkflow({
        publicClient: this.publicClient,
        walletClient: this.walletClient,
        orchestratorAddress,
        workflowOrientation,
        self: this,
      })
      this.workflows.set(orchestratorAddress, workflow)
      return workflow
    }
  }

  getDeployOptions = getDeployOptions

  getDeploy<T extends RequestedModules<FT>, FT extends FactoryType = 'default'>(
    requestedModules: T,
    factoryType?: FT
  ) {
    if (!this.walletClient)
      throw new Error('Wallet client is required for deploy')

    const result = getDeploy({
      publicClient: this.publicClient,
      walletClient: this.walletClient,
      requestedModules,
      self: this,
      factoryType,
    })

    return result as W extends undefined ? never : typeof result
  }
}
