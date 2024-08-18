import getModule from './getModule'
import { ERC20_ABI, FM_BASE } from './utils/constants'

import { type Hex } from 'viem'
import { getModuleData, type GetModuleNameByType } from '@inverter-network/abis'
import type {
  PopWalletClient,
  WorkflowModuleType,
  WorkflowRequestedModules,
  Workflow,
  GetWorkflowParams,
  FlattenObjectValues,
} from './types'

export default async function getWorkflow<
  O extends WorkflowRequestedModules | undefined = undefined,
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

  const { readContract } = publicClient

  // 2. gather extras
  const erc20Address = <Hex>await readContract({
      address: fundingManagerAddress,
      abi: FM_BASE,
      functionName: 'token',
    }),
    erc20Decimals = <number>await readContract({
      address: erc20Address,
      abi: ERC20_ABI,
      functionName: 'decimals',
    }),
    erc20Symbol = <string>await readContract({
      address: erc20Address,
      abi: ERC20_ABI,
      functionName: 'symbol',
    }),
    erc20Module = getModule({
      publicClient,
      walletClient,
      address: erc20Address,
      name: 'ERC20',
      extras: {
        decimals: erc20Decimals,
      },
      self,
    })

  // 3. initialize modules with extras
  const modules = await (async () => {
    // 0. Define the source data based on the optional requestedModules
    const source = await (async () => {
      type Name = O extends WorkflowRequestedModules
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
        extras: {
          defaultToken: erc20Address,
          decimals: erc20Decimals,
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
    erc20Module,
    erc20Decimals,
    erc20Symbol,
  }

  return returns
}
