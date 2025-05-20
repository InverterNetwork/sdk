// external dependencies
import type { ModuleName } from '@inverter-network/abis'
// sdk types
import type {
  DeployableContracts,
  DeployBytecodeParams,
  DeployBytecodeReturnType,
  DeployWriteParams,
  GetDeployWorkflowArgs,
  GetModuleParams,
  GetModuleReturnType,
  GetSimulatedWorkflowParams,
  GetSimulatedWorkflowReturnType,
  MethodOptions,
  MixedRequestedModules,
  ModuleData,
  ModuleMulticallParams,
  ModuleMulticallSimulateReturnType,
  ModuleMulticallWriteReturnType,
  PopPublicClient,
  PopWalletClient,
  SimulatedWorkflowToken,
  Workflow,
  WorkflowIssuanceToken,
  WorkflowToken,
} from '@/types'
import lodash from 'lodash'
import type { Except } from 'type-fest-4'

import { deploy } from './deploy'
import { deployWorkflow } from './deploy-workflow'
import { getDeployWorkflowOptions } from './get-deploy-workflow-options'
import { getModule } from './get-module'
import { getSimulatedWorkflow } from './get-simulated-workflow'
// sdk utils
import { getWorkflow } from './get-workflow'
import { moduleMulticall } from './module-multicall'

/**
 * @description The Inverter class is the main class for interacting with the Inverter Network
 * @template TWalletClient - The wallet client
 * @param publicClient - The public client
 * @param walletClient - The wallet client
 * @example
 * ```ts
 * const inverter = Inverter.getInstance({
 *   publicClient,
 *   walletClient,
 * })
 * ```
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
   * @see {@link getWorkflow}
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
   * @see {@link deployWorkflow}
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
   * @see {@link deploy}
   */
  deploy = {
    write: <T extends DeployableContracts>(
      params: Omit<DeployWriteParams<T>, 'walletClient' | 'publicClient'>,
      options?: MethodOptions
    ) => {
      if (!this.walletClient)
        throw new Error('Wallet client is required for deploy')

      return deploy.write(
        {
          ...params,
          publicClient: this.publicClient,
          walletClient: this.walletClient,
        },
        options
      )
    },
    bytecode: <T extends DeployableContracts>(
      params: Omit<DeployBytecodeParams<T>, 'publicClient' | 'walletClient'>
    ): Promise<DeployBytecodeReturnType> => {
      if (!this.walletClient)
        throw new Error('Wallet client is required for deploy')

      return deploy.bytecode({
        ...params,
        publicClient: this.publicClient,
        walletClient: this.walletClient,
      })
    },
  }

  /**
   * @see {@link getModule}
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
   * @see {@link moduleMulticall}
   */
  moduleMulticall: {
    write: (
      params: Except<ModuleMulticallParams, 'publicClient' | 'walletClient'>,
      options?: MethodOptions
    ) => Promise<ModuleMulticallWriteReturnType>
    simulate: (
      params: Except<ModuleMulticallParams, 'publicClient' | 'walletClient'>
    ) => Promise<ModuleMulticallSimulateReturnType>
  } = {
    write: async (params, options) => {
      if (!this.walletClient)
        throw new Error('Wallet client is required for multicall')

      return await moduleMulticall.write(
        {
          ...params,
          publicClient: this.publicClient,
          walletClient: this.walletClient!,
        },
        options
      )
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

  /**
   * @see {@link getSimulatedWorkflow}
   */
  async getSimulatedWorkflow<
    T extends MixedRequestedModules,
    TDeployWorkflowArgs extends GetDeployWorkflowArgs<T>,
    TToken extends SimulatedWorkflowToken | undefined = undefined,
  >(
    params: Omit<
      GetSimulatedWorkflowParams<T, TDeployWorkflowArgs, TToken>,
      'publicClient' | 'walletClient'
    >
  ): Promise<GetSimulatedWorkflowReturnType<TToken>> {
    return getSimulatedWorkflow({
      ...params,
      publicClient: this.publicClient,
      walletClient: this.walletClient!,
    })
  }
}
