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
  ModuleType,
  ModuleVersion,
  FlatFundingManager_ABI,
  // FlatModule_ABI,
} from '@inverter-network/abis'

type WorkflowOrientation = {
  [T in Exclude<ModuleType, 'orchestrator' | 'external'>]: {
    name: Extract<ModuleVersion, { moduleType: T }>['name']
    version: Extract<ModuleVersion, { moduleType: T }>['version']
  }
}

export default async function getWorkflow<
  // O extends WorkflowOrientation | undefined,
  O extends WorkflowOrientation,
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
  // with optional workflowOrientation TODO
  // workflowOrientation?: O
  workflowOrientation: O
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

  // 2. gather extras
  const erc20Address = await getContract({
      address: await orchestrator.read.fundingManager.run(),
      abi: FlatFundingManager_ABI,
      publicClient,
    }).read.token(),
    erc20Module = getModule({
      publicClient,
      walletClient,
      address: erc20Address,
      name: 'ERC20',
      version: 'v1.0',
    }),
    erc20Decimals = await erc20Module.read.decimals.run(),
    erc20Symbol = await erc20Module.read.symbol.run()

  // 3. initialize modules with extras
  const modules = (
    await Promise.all(
      Object.values(workflowOrientation).map(async ({ name, version }) => {
        const address =
          await orchestrator.read.findModuleAddressInOrchestrator.run(name)

        return getModule({
          name,
          version,
          address,
          publicClient,
          walletClient,
          extras: {
            decimals: erc20Decimals,
          },
        })
      })
    )
  ).reduce((acc: any, curr) => {
    acc[curr.moduleType] = curr
    return acc
  }, {}) as {
    [K in keyof WorkflowOrientation]: ReturnType<
      typeof getModule<O[K]['name'], O[K]['version'], W>
    >
  }

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

// with optional workflowOrientation TODO
// const addressAndVersions = (async () => {
//   if (!workflowOrientation)
//     return await Promise.all(
//       (await orchestrator.read.listModules.run()).map(async (address) => {
//         const contract = getContract({
//           client,
//           address,
//           abi: FlatModule_ABI,
//         })

//         const name = await contract.read.title(),
//           version = await contract.read.version()

//         return { name, version, address }
//       })
//     )

//   return await Promise.all(
//     Object.values(workflowOrientation).map(async ({ name, version }) => {
//       const address =
//         await orchestrator.read.findModuleAddressInOrchestrator.run(name)

//       return { name, version, address }
//     })
//   )
// })()
