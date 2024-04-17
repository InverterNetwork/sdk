import {
  getContract,
  PublicClient,
  WalletClient,
  Hex,
  Account,
  Chain,
  Transport,
} from 'viem'
import getModule from './getModule'
import {
  UserFacingModuleType,
  ModuleVersion,
  getModuleVersion,
} from '@inverter-network/abis'

type WorkflowOrientation = {
  [T in Exclude<UserFacingModuleType, 'orchestrator'>]: {
    name: Extract<ModuleVersion, { moduleType: T }>['name']
    version: Extract<ModuleVersion, { moduleType: T }>['version']
  }
}

export default async function getWorkflow<
  O extends WorkflowOrientation | undefined = undefined,
  W extends WalletClient<Transport, Chain, Account> | undefined = undefined,
>({
  publicClient,
  walletClient,
  orchestratorAddress,
  workflowOrientation,
}: {
  publicClient: PublicClient<Transport, Chain>
  walletClient?: W
  orchestratorAddress: Hex
  workflowOrientation?: O
}) {
  if (!publicClient) throw new Error('Public client not initialized')

  // 1. initialize orchestrator
  const orchestrator = getModule({
    name: 'Orchestrator',
    version: 'v1.0',
    address: orchestratorAddress,
    publicClient,
    walletClient,
  })

  const fundingManagerAddress = await orchestrator.read.fundingManager.run()
  // 2. gather extras
  const erc20Address = await getContract({
    address: fundingManagerAddress,
    abi: getModuleVersion('RebasingFundingManager', 'v1.0').abi,
    client: {
      public: publicClient,
    },
  }).read.token()

  const erc20Contract = getContract({
      address: erc20Address,
      abi: getModuleVersion('ERC20', 'v1.0').abi,
      client: { public: publicClient },
    }),
    erc20Decimals = await erc20Contract.read.decimals(),
    erc20Symbol = await erc20Contract.read.symbol(),
    erc20Module = getModule({
      publicClient,
      walletClient,
      address: erc20Address,
      name: 'ERC20',
      version: 'v1.0',
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
            Object.values(workflowOrientation).map(async (i) => ({
              ...i,
              address:
                await orchestrator.read.findModuleAddressInOrchestrator.run(
                  i.name
                ),
            }))
          )
        : // 3. If not defined, list all modules from the orchestrator for their-
          // address then get the title and version
          await Promise.all(
            (await orchestrator.read.listModules.run()).map(async (address) => {
              const flatModule = getModule({
                  publicClient,
                  walletClient,
                  address,
                  name: 'Module',
                  version: 'v1.0',
                }),
                name = <ModuleVersion['name']>await flatModule.read.title.run(),
                [major, minor] = await flatModule.read.version.run(),
                version = <ModuleVersion['version']>(() => {
                  const initialRes = `v${major}.${minor}`
                  if (initialRes.length > 4) return 'v1.0'
                  return initialRes
                })()

              return { name, version, address }
            })
          )

    // 4. Map the module array using the source data
    const modulesArray = source.map(({ name, version, address }) =>
      getModule({
        name,
        version,
        address,
        publicClient,
        walletClient,
        extras: {
          decimals: erc20Decimals,
        },
      })
    )

    // 5. Reduce the array to an object with the moduleType as key
    const result = modulesArray.reduce((acc: any, curr) => {
      acc[curr.moduleType] = curr
      return acc
    }, {}) as {
      [K in keyof WorkflowOrientation]: O extends NonNullable<O>
        ? ReturnType<typeof getModule<O[K]['name'], O[K]['version'], W>>
        : ReturnType<
            typeof getModule<
              WorkflowOrientation[K]['name'],
              WorkflowOrientation[K]['version'],
              W
            >
          >
    }

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
