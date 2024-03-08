import {
  getContract,
  PublicClient,
  WalletClient,
  Hex,
  Account,
  Chain,
  Transport,
  erc20Abi,
} from 'viem'
import getModule from './getModule'
import {
  ModuleType,
  ModuleVersion,
  FlatFundingManager_ABI,
} from '@inverter-network/abis'

type WorkflowOrientation = {
  [T in Exclude<ModuleType, 'orchestrator'>]: {
    name: Extract<ModuleVersion, { moduleType: T }>['name']
    version: Extract<ModuleVersion, { moduleType: T }>['version']
  }
}

export default async function getWorkflow<O extends WorkflowOrientation>({
  publicClient,
  walletClient,
  orchestratorAddress,
  workflowOrientation,
}: {
  publicClient: PublicClient<Transport, Chain>
  walletClient?: WalletClient<Transport, Chain, Account>
  orchestratorAddress: Hex
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
      client: {
        public: publicClient,
      },
    }).read.token(),
    erc20Contract = getContract({
      client: { public: publicClient, wallet: walletClient },
      address: erc20Address,
      abi: erc20Abi,
    }),
    erc20Decimals = await erc20Contract.read.decimals(),
    erc20Symbol = await erc20Contract.read.symbol()

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
      typeof getModule<O[K]['name'], O[K]['version']>
    >
  }

  // RETURN WORKFLOW CONFIG
  const returns = {
    ...modules,
    orchestrator,
    erc20Contract,
    erc20Decimals,
    erc20Symbol,
  }

  return returns
}
