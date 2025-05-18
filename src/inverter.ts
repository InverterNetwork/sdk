// external dependencies
import type { ModuleName } from '@inverter-network/abis'
import lodash from 'lodash'

// sdk types
import type {
  PopPublicClient,
  PopWalletClient,
  Workflow,
  GetModuleParams,
  DeployableContracts,
  GetDeployWorkflowModuleArg,
  MethodOptions,
  WorkflowIssuanceToken,
  WorkflowToken,
  MixedRequestedModules,
  ModuleData,
  GetModuleReturnType,
  ModuleMulticallParams,
  ModuleMulticallWriteReturnType,
  ModuleMulticallSimulateReturnType,
} from '@/types'

// sdk utils
import { getWorkflow } from './get-workflow'
import { deployWorkflow } from './deploy-workflow'
import { getDeployWorkflowOptions } from './get-deploy-workflow-options'
import { deploy } from './deploy'
import { getModule } from './get-module'
import { moduleMulticall } from './module-multicall'
import type { Except } from 'type-fest-4'

/**
 * @description The Inverter class is the main class for interacting with the Inverter Network
 * @template TWalletClient - The wallet client
 * @param publicClient - The public client
 * @param walletClient - The wallet client
 */
export class Inverter<
  TWalletClient extends PopWalletClient | undefined = undefined,
> {
  publicClient: PopPublicClient
  walletClient: TWalletClient
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
    walletClient?: TWalletClient
  }) {
    this.publicClient = publicClient
    this.walletClient = walletClient as TWalletClient
    this.workflows = new Map()
    this.tokenCache = new Map()
  }

  /**
   * @description Get the singleton instance of the Inverter
   * @template TWalletClient - The wallet client
   * @param publicClient - The public client
   * @param walletClient - The wallet client
   * @returns The singleton instance of the Inverter
   */
  static getInstance<
    TWalletClient extends PopWalletClient | undefined = undefined,
  >({
    publicClient,
    walletClient,
  }: {
    publicClient: PopPublicClient
    walletClient?: TWalletClient
  }): Inverter<TWalletClient> {
    if (!Inverter.instance) {
      Inverter.instance = new Inverter<TWalletClient>({
        publicClient,
        walletClient,
      })
    }

    if (!lodash.isEqual(Inverter.instance.publicClient, publicClient))
      Inverter.instance.updatePublicClient(publicClient)

    if (!lodash.isEqual(Inverter.instance.walletClient, walletClient))
      Inverter.instance.updateWalletClient(walletClient)

    return Inverter.instance as Inverter<TWalletClient>
  }

  /**
   * @description Updates the publicClient safely
   * @param publicClient - The public client
   */
  private updatePublicClient(publicClient: PopPublicClient) {
    this.publicClient = publicClient
  }

  /**
   * @description Updates the walletClient safely
   * @param walletClient - The wallet client
   */
  private updateWalletClient(walletClient: TWalletClient) {
    this.walletClient = walletClient
  }

  /**
   * @description Get a workflow
   * @template T - The requested modules
   * @template TFundingToken - The funding token
   * @template TIssuanceToken - The issuance token
   * @param params - The parameters for the workflow
   * @param params.orchestratorAddress - The address of the orchestrator
   * @param params.requestedModules - The requested modules
   * @param params.fundingTokenType - The type of funding token default is ERC20
   * @param params.issuanceTokenType - The type of issuance token default is ERC20Issuance_v1
   * @returns The workflow
   */
  async getWorkflow<
    T extends MixedRequestedModules | undefined = undefined,
    TFundingToken extends WorkflowToken | undefined = undefined,
    TIssuanceToken extends WorkflowIssuanceToken | undefined = undefined,
  >({
    orchestratorAddress,
    requestedModules,
    fundingTokenType,
    issuanceTokenType,
  }: {
    orchestratorAddress: `0x${string}`
    requestedModules?: T
    fundingTokenType?: TFundingToken
    issuanceTokenType?: TIssuanceToken
  }): Promise<Workflow<T, TWalletClient, TFundingToken, TIssuanceToken>> {
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
        fundingTokenType,
        issuanceTokenType,
        self: this,
      })
      this.workflows.set(chainOrchestratorAddress, workflow)
      return workflow
    }
  }

  getDeployWorkflowOptions = getDeployWorkflowOptions

  /**
   * @description Retreive the deploy workflow methods and inputs array
   * @template T - The requested modules
   * @param params - The parameters for the deploy options
   * @param params.requestedModules - The requested modules
   * @param params.factoryType - The factory type
   * @returns The deploy options
   */
  deployWorkflow<T extends MixedRequestedModules>({
    requestedModules,
  }: {
    requestedModules: T
  }) {
    if (!this.walletClient)
      throw new Error('Wallet client is required for deploy')

    const result = deployWorkflow({
      publicClient: this.publicClient,
      walletClient: this.walletClient,
      requestedModules,
      // @ts-ignore
      self: this,
    })

    return result as TWalletClient extends undefined ? never : typeof result
  }

  /**
   * @description Deploy a contract
   * @template T - The deployable contract
   * @param params - The parameters for the deploy
   * @param params.name - The name of the contract
   * @param params.args - The arguments for the deploy
   * @returns The result of the deploy
   */
  deploy<T extends DeployableContracts>(
    {
      name,
      args,
    }: {
      name: T
      args: GetDeployWorkflowModuleArg<T>
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

  /**
   * @description Get a module
   * @template TModuleName - The module name
   * @template TModuleData - The module data
   * @param params - The parameters for the module
   * @returns The module
   */
  getModule<
    TModuleName extends TModuleData extends ModuleData ? never : ModuleName,
    TModuleData extends ModuleData | undefined = undefined,
  >(
    params: Omit<
      GetModuleParams<TModuleName, TWalletClient, TModuleData>,
      'walletClient' | 'publicClient' | 'self'
    >
  ): GetModuleReturnType<TModuleName, TWalletClient, TModuleData> {
    return getModule({
      ...params,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
      self: this,
    } as any)
  }

  /**
   * @description Multicall - Execute multiple inverter module write methods in a single transaction
   * @param params - The parameters for the multicall
   * @param params.calls - The calls to execute
   * @returns The result of the multicall
   */
  moduleMulticall: {
    write: (
      params: Except<ModuleMulticallParams, 'publicClient' | 'walletClient'>
    ) => Promise<ModuleMulticallWriteReturnType>
    simulate: (
      params: Except<ModuleMulticallParams, 'publicClient' | 'walletClient'>
    ) => Promise<ModuleMulticallSimulateReturnType>
  } = {
    write: async (params) => {
      if (!this.walletClient)
        throw new Error('Wallet client is required for multicall')

      return await moduleMulticall.write({
        ...params,
        publicClient: this.publicClient,
        walletClient: this.walletClient!,
      })
    },
    simulate: async (params) => {
      if (!this.walletClient)
        throw new Error('Wallet client is required for multicall')

      return await moduleMulticall.simulate({
        ...params,
        publicClient: this.publicClient,
        walletClient: this.walletClient!,
      })
    },
  }
}
