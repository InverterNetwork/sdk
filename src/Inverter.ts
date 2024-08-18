import getWorkflow from './getWorkflow'
import getDeploy from './getDeploy'
import getDeployOptions from './getDeployOptions'

import type {
  PopPublicClient,
  PopWalletClient,
  WorkflowRequestedModules,
  Workflow,
  RequestedModules,
  FactoryType,
  DeployERC20Params,
} from './types'
import deployERC20 from './deployERC20'

export class Inverter<W extends PopWalletClient | undefined = undefined> {
  readonly publicClient: PopPublicClient
  readonly walletClient: W
  readonly workflows: Map<`0x${string}`, any>
  tokenCache: Map<string, any>

  constructor({
    publicClient,
    walletClient,
  }: {
    publicClient: PopPublicClient
    walletClient?: W
  }) {
    this.publicClient = publicClient
    this.walletClient = walletClient as W
    this.workflows = new Map()
    this.tokenCache = new Map()
  }

  async getWorkflow<
    T extends WorkflowRequestedModules | undefined = undefined,
  >({
    orchestratorAddress,
    requestedModules,
  }: {
    orchestratorAddress: `0x${string}`
    requestedModules?: T
  }): Promise<Workflow<W, T>> {
    const cachedWorkflow = this.workflows.get(orchestratorAddress)
    if (cachedWorkflow) return cachedWorkflow
    else {
      const workflow = await getWorkflow({
        publicClient: this.publicClient,
        walletClient: this.walletClient,
        orchestratorAddress,
        requestedModules,
        self: this,
      })
      this.workflows.set(orchestratorAddress, workflow)
      return workflow
    }
  }

  getDeployOptions = getDeployOptions

  getDeploy<
    T extends RequestedModules<FT>,
    FT extends FactoryType = 'default',
  >({
    requestedModules,
    factoryType,
  }: {
    requestedModules: T
    factoryType?: FT
  }) {
    if (!this.walletClient)
      throw new Error('Wallet client is required for deploy')

    const result = getDeploy({
      publicClient: this.publicClient,
      walletClient: this.walletClient,
      requestedModules,
      // @ts-ignore
      self: this,
      factoryType,
    })

    return result as W extends undefined ? never : typeof result
  }

  deployERC20(
    params: Omit<DeployERC20Params, 'walletClient' | 'publicClient'>
  ) {
    if (!this.walletClient)
      throw new Error('Wallet client is required for deploy')

    return deployERC20({
      ...params,
      walletClient: this.walletClient,
      publicClient: this.publicClient,
    })
  }
}
