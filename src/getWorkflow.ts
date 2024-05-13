import { Hex } from 'viem'
import getModule from './getModule'
import {
  UserFacingModuleType,
  GetModuleNameByType,
} from '@inverter-network/abis'
import { OmitNever, PopPublicClient, PopWalletClient } from './types'
import { Merge } from 'type-fest'
import { TOKEN_DATA_ABI } from './utils/constants'

type OrientationPart<
  MT extends UserFacingModuleType,
  N extends GetModuleNameByType<MT> = GetModuleNameByType<MT>,
> = N

type WorkflowOrientation = Merge<
  {
    [T in Exclude<UserFacingModuleType, 'logicModule'>]: OrientationPart<T>
  },
  {
    logicModules?: OrientationPart<'logicModule'>[]
  }
>

export default async function getWorkflow<
  O extends WorkflowOrientation | undefined = undefined,
  W extends PopWalletClient | undefined = undefined,
>({
  publicClient,
  walletClient,
  orchestratorAddress,
  workflowOrientation,
}: {
  publicClient: PopPublicClient
  walletClient?: W
  orchestratorAddress: Hex
  workflowOrientation?: O
}) {
  if (!publicClient) throw new Error('Public client not initialized')

  // 1. initialize orchestrator
  const orchestrator = getModule({
    name: 'Orchestrator_v1',
    address: orchestratorAddress,
    publicClient,
    walletClient,
  })

  const fundingManagerAddress = await orchestrator.read.fundingManager.run()

  const { readContract } = publicClient

  // 2. gather extras
  const erc20Address = <Hex>await readContract({
      address: fundingManagerAddress,
      abi: TOKEN_DATA_ABI,
      functionName: 'token',
    }),
    erc20Decimals = <number>await readContract({
      address: erc20Address,
      abi: TOKEN_DATA_ABI,
      functionName: 'decimals',
    }),
    erc20Symbol = <string>await readContract({
      address: erc20Address,
      abi: TOKEN_DATA_ABI,
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
    })

  // 3. initialize modules with extras
  const modules = await (async () => {
    // 0. Define the source data based on the optional workflowOrientation
    const source =
      // 1. Check if workflowOrientation is defined
      !!workflowOrientation
        ? // 2. If defined, map over the values and find the address of the module
          await Promise.all(
            Object.values(workflowOrientation)
              .flat()
              .map(async (name) => {
                const address =
                  await orchestrator.read.findModuleAddressInOrchestrator.run(
                    name
                  )
                return { name, address }
              })
          )
        : // 3. If not defined, list all modules from the orchestrator for their-
          // address then get the title and version
          await Promise.all(
            (await orchestrator.read.listModules.run()).map(async (address) => {
              type Name = GetModuleNameByType<UserFacingModuleType>
              const flatModule = getModule({
                  publicClient,
                  walletClient,
                  address,
                  name: 'Module',
                }),
                name = <Name>await flatModule.read.title.run()

              return { name, address }
            })
          )

    // 4. Map the module array using the source data
    const modulesArray = source.map(({ name, address }) => {
      return getModule({
        name,
        address,
        publicClient,
        walletClient,
        extras: {
          decimals: erc20Decimals,
        },
      })
    })

    type MendatoryResult = {
      [K in Exclude<
        UserFacingModuleType,
        'logicModule'
      >]: O extends NonNullable<O>
        ? ReturnType<typeof getModule<O[K], W>>
        : ReturnType<typeof getModule<WorkflowOrientation[K], W>>
    }

    type OptionalResult = OmitNever<{
      logicModules: O extends NonNullable<O>
        ? O['logicModules'] extends NonNullable<O['logicModules']>
          ? {
              [K in O['logicModules'][number]]: ReturnType<
                typeof getModule<K, W>
              >
            }
          : never
        : {
            [K in NonNullable<
              WorkflowOrientation['logicModules']
            >[number]]: ReturnType<typeof getModule<K, W>>
          }
    }>

    type Result = MendatoryResult & OptionalResult

    // 5. Reduce the array to an object with the moduleType as key
    const result = modulesArray.reduce(
      (acc, curr) => {
        if (curr.moduleType === 'logicModule')
          acc.logicModules = {
            ...acc.logicModules,
            [curr.name]: curr,
          }
        else acc[curr.moduleType] = curr
        return acc
      },
      {
        authorizer: {},
        fundingManager: {},
        paymentProcessor: {},
        logicModules: {},
      }
    ) as unknown as Result

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
