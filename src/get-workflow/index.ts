// @inverter-network/abis
import { getModuleData } from '@inverter-network/abis'
import type { GetModuleNameByType } from '@inverter-network/abis'

// sdk types
import type {
  PopWalletClient,
  WorkflowModuleType,
  RequestedModules,
  Workflow,
  GetWorkflowParams,
  FlattenObjectValues,
  GetWorkflowTokenResultReturnType,
} from '@/types'

// sdk utils
import { getModule } from '@/get-module'
import getTokenResults from './token'

/**
 * @description Get a Inverter workflow
 * @template O - The requested modules
 * @template W - The wallet client
 * @param params - The parameters for the gathering of a workflow
 * @returns The result of the workflow
 */
export async function getWorkflow<
  O extends RequestedModules | undefined = undefined,
  W extends PopWalletClient | undefined = undefined,
>({
  publicClient,
  walletClient,
  orchestratorAddress,
  self,
}: GetWorkflowParams<O, W>): Promise<Workflow<W, O>> {
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

  const fundingToken = await getTokenResults.getFundingTokenResults({
    fundingManagerAddress,
    publicClient,
    walletClient,
    self,
  })

  let issuanceToken: GetWorkflowTokenResultReturnType<
    'ERC20Issuance_v1',
    W
  > | null = null

  try {
    issuanceToken = await getTokenResults.getIssuanceTokenResults({
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
      type Name = O extends RequestedModules
        ? FlattenObjectValues<O>
        : GetModuleNameByType<WorkflowModuleType>

      // 1. fetch the module addresses
      const moduleAddresses = await orchestrator.read.listModules.run()
      // 2. fetch flat modules
      return await Promise.all(
        moduleAddresses.map(async (address) => {
          const name = <Name>await publicClient.readContract({
            address,
            abi: getModuleData('Module_v1').abi,
            functionName: 'title',
          })

          return { name, address }
        })
      )
    })()

    // 4. Map the module array using the source data
    const modulesArray = source.map(({ name, address }) => {
      return getModule({
        name,
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
