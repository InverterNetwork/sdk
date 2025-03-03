// external dependencies
import lodash from 'lodash'

// sdk types
import type { ModuleName } from '@inverter-network/abis'
import type {
  PopPublicClient,
  PopWalletClient,
  RequestedModules,
  Workflow,
  FactoryType,
  GetModuleParams,
  DeployableContracts,
  GetUserModuleArg,
  MethodOptions,
} from '@/types'

// sdk utils
import getWorkflow from './get-workflow'
import getDeploy from './get-deploy'
import getDeployOptions from './get-deploy-options'
import deploy from './deploy'
import getModule from './get-module'

export class Inverter<W extends PopWalletClient | undefined = undefined> {
  publicClient: PopPublicClient
  walletClient: W
  readonly workflows: Map<`${number}:0x${string}`, any>
  tokenCache: Map<string, any>

  // Static instance of the Inverter
  private static instance: Inverter<any> | null = null

  // Private constructor to prevent external instantiation
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

  /**
   * Static method to get the singleton instance
   * Uses the correct `new` to instantiate the Inverter internally
   */
  static getInstance<W extends PopWalletClient | undefined = undefined>({
    publicClient,
    walletClient,
  }: {
    publicClient: PopPublicClient
    walletClient?: W
  }): Inverter<W> {
    if (!Inverter.instance) {
      Inverter.instance = new Inverter<W>({ publicClient, walletClient })
    }

    if (!lodash.isEqual(Inverter.instance.publicClient, publicClient))
      Inverter.instance.updatePublicClient(publicClient)

    if (!lodash.isEqual(Inverter.instance.walletClient, walletClient))
      Inverter.instance.updateWalletClient(walletClient)

    return Inverter.instance as Inverter<W>
  }

  /**
   * Updates the publicClient safely
   */
  private updatePublicClient(publicClient: PopPublicClient) {
    this.publicClient = publicClient
  }

  /**
   * Updates the walletClient safely
   */
  private updateWalletClient(walletClient: W) {
    this.walletClient = walletClient
  }

  async getWorkflow<T extends RequestedModules | undefined = undefined>({
    orchestratorAddress,
    requestedModules,
  }: {
    orchestratorAddress: `0x${string}`
    requestedModules?: T
  }): Promise<Workflow<W, T>> {
    const chainId = this.publicClient.chain.id

    const chainOrchestratorAddress =
      `${chainId}:${orchestratorAddress}` as const

    const cachedWorkflow = this.workflows.get(chainOrchestratorAddress)

    const workflowHasNoWalletClient = !cachedWorkflow?.orchestrator?.write

    const missingWalletClientInCache =
      this.walletClient && workflowHasNoWalletClient

    const unwantedWalletClientInCache =
      !this.walletClient && !workflowHasNoWalletClient

    if (
      cachedWorkflow &&
      !missingWalletClientInCache &&
      !unwantedWalletClientInCache
    )
      return cachedWorkflow
    else {
      const workflow = await getWorkflow({
        publicClient: this.publicClient,
        walletClient: this.walletClient,
        orchestratorAddress,
        requestedModules,
        self: this,
      })
      this.workflows.set(chainOrchestratorAddress, workflow)
      return workflow
    }
  }

  getDeployOptions = getDeployOptions

  getDeploy<
    T extends RequestedModules<FT extends undefined ? 'default' : FT>,
    FT extends FactoryType | undefined = undefined,
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

  deploy<T extends DeployableContracts>(
    {
      name,
      args,
    }: {
      name: T
      args: GetUserModuleArg<T>
    },
    options?: MethodOptions
  ) {
    if (!this.walletClient)
      throw new Error('Wallet client is required for deploy')

    return deploy(
      {
        name,
        walletClient: this.walletClient,
        publicClient: this.publicClient,
        args,
      },
      options
    )
  }

  getModule<N extends ModuleName>(
    params: Omit<
      GetModuleParams<N, W>,
      'walletClient' | 'publicClient' | 'self'
    >
  ) {
    return getModule({
      ...params,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
      self: this,
    })
  }
}
