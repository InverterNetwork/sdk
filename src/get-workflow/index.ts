// dependencies

// @inverter-network/abis
import { getModuleData } from '@inverter-network/abis'
// sdk utils
import { getModule } from '@/get-module'
// sdk types
import type {
  GetWorkflowParams,
  GetWorkflowTokenReturnType,
  MixedRequestedModules,
  ModuleData,
  PopWalletClient,
  Workflow,
  WorkflowIssuanceToken,
  WorkflowToken,
} from '@/types'

import getTokenResults from './token'

/**
 * @description Get a Inverter workflow
 * @template TRequestedModules - The requested modules
 * @template TWalletClient - The wallet client
 * @template TFundingToken - The funding token
 * @template TIssuanceToken - The issuance token
 * @param params - The parameters for the gathering of a workflow
 * @param params.requestedModules - The requested modules
 * @param params.publicClient - The public client
 * @param params.walletClient - The wallet client
 * @param params.orchestratorAddress - The orchestrator address
 * @param params.self - The inverter sdk instance
 * @param params.fundingTokenType - The funding token type
 * @param params.issuanceTokenType - The issuance token type
 * @returns The result of the workflow
 * @example
 * ```ts
 * const {
 *   orchestrator,
 *   authorizer,
 *   fundingManager,
 *   paymentProcessor,
 *   optionalModule,
 *   fundingToken,
 *   issuanceToken,
 * } = await getWorkflow({
 *   requestedModules,
 *   publicClient,
 *   walletClient,
 *   orchestratorAddress,
 *   self,
 *   fundingTokenType,
 *   issuanceTokenType,
 * })
 * ```
 */
export async function getWorkflow<
  TRequestedModules extends MixedRequestedModules | undefined = undefined,
  TWalletClient extends PopWalletClient | undefined = undefined,
  TFundingToken extends WorkflowToken | undefined = undefined,
  TIssuanceToken extends WorkflowIssuanceToken | undefined = undefined,
>({
  requestedModules,
  publicClient,
  walletClient,
  orchestratorAddress,
  self,
  fundingTokenType = 'ERC20' as any,
  issuanceTokenType = 'ERC20Issuance_v1' as any,
}: GetWorkflowParams<
  TRequestedModules,
  TWalletClient,
  TFundingToken,
  TIssuanceToken
>): Promise<
  Workflow<TRequestedModules, TWalletClient, TFundingToken, TIssuanceToken>
> {
  if (!publicClient) throw new Error('Public client not initialized')

  // 1. initialize orchestrator
  const orchestrator = getModule({
    name: 'Orchestrator_v1',
    address: orchestratorAddress,
    publicClient,
    walletClient,
    self,
  })

  const fundingManagerAddress = await orchestrator.read.fundingManager.run()

  const fundingToken = await getTokenResults.getFundingToken({
    tokenType: fundingTokenType,
    fundingManagerAddress,
    publicClient,
    walletClient,
    self,
  })

  type IssuanceTokenName = TIssuanceToken extends undefined
    ? 'ERC20Issuance_v1'
    : TIssuanceToken

  let issuanceToken: GetWorkflowTokenReturnType<
    IssuanceTokenName,
    TWalletClient
  > | null = null

  try {
    issuanceToken = await getTokenResults.getIssuanceToken({
      tokenType: issuanceTokenType as IssuanceTokenName,
      fundingManagerAddress,
      publicClient,
      walletClient,
      self,
    })
  } catch {
    issuanceToken = null
  }

  // 3. initialize modules with extras
  const modules = await (async () => {
    // 0. Define the source data based on the optional requestedModules
    const source = await (async () => {
      // 1. fetch the module addresses
      const moduleAddresses = await orchestrator.read.listModules.run()
      const moduleAbi = getModuleData('Module_v1').abi
      // 2. fetch flat modules
      return await Promise.all(
        moduleAddresses.map(async (address) => {
          const name: any = await publicClient.readContract({
            address,
            abi: moduleAbi,
            functionName: 'title',
          })

          const moduleData: ModuleData | undefined = (() => {
            let found

            Object.values(requestedModules ?? {}).forEach((m) => {
              if (Array.isArray(m)) {
                m.forEach((o) => {
                  if (typeof o === 'object' && o.name === name) {
                    found = o
                  }
                })
              } else if (typeof m === 'object' && m.name === name) {
                found = m
              }
            })

            return found
          })()

          return { name, address, moduleData }
        })
      )
    })()

    // 4. Map the module array using the source data
    const modulesArray = source.map(({ name, address, moduleData }) => {
      const md: ModuleData | undefined = moduleData
      return getModule({
        ...((!!md ? { moduleData: md } : { name }) as any),
        address,
        publicClient,
        walletClient,
        tagConfig: {
          defaultToken: fundingToken.address,
          decimals: fundingToken.decimals,
          issuanceTokenDecimals: issuanceToken?.decimals,
          issuanceToken: issuanceToken?.address,
        },
        self,
      })
    })

    // 5. Reduce the array to an object with the moduleType as key
    const result = modulesArray.reduce(
      (acc, curr) => {
        if (curr.moduleType === 'optionalModule')
          acc.optionalModule = {
            ...acc.optionalModule,
            [curr.name]: curr,
          }
        else acc[curr.moduleType] = curr
        return acc
      },
      {
        authorizer: {},
        fundingManager: {},
        paymentProcessor: {},
        optionalModule: {},
      } as Record<string, any>
    ) as any

    return result
  })()

  // RETURN WORKFLOW CONFIG
  const returns = {
    ...modules,
    orchestrator,
    fundingToken,
    ...(issuanceToken && { issuanceToken }),
  }

  return returns
}
