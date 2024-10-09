import { graphql, Inverter, type PopPublicClient } from '@'
import { expect, describe, it, beforeAll } from 'bun:test'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { optimismSepolia } from 'viem/chains'

describe('#INDEXER_SUBSCRIPTION', () => {
  const subscriptionInstance = graphql.subscription({
    Workflow: {
      id: true,
    },
  })

  let id: string | null = null

  beforeAll(async () => {
    const awaited = await subscriptionInstance

    awaited.addCallback((data) => {
      id = data.Workflow[0].id
    })
  })

  it(
    '1. Should Deploy A Workflow',
    async () => {
      const publicClient = createPublicClient({
        chain: optimismSepolia,
        transport: http(),
      }) as unknown as PopPublicClient

      // Wallet Client used to write data to the blockchain
      const walletClient = createWalletClient({
        account: privateKeyToAccount(
          process.env.TEST_DEV_WALLET_PRIVATE_KEY as `0x${string}`
        ),
        chain: optimismSepolia,
        transport: http(),
      })

      const sdk = new Inverter({ publicClient, walletClient })

      const { run } = await sdk.getDeploy({
        requestedModules: {
          authorizer: 'AUT_Roles_v1',
          fundingManager: 'FM_DepositVault_v1',
          paymentProcessor: 'PP_Simple_v1',
        },
      })

      const { orchestratorAddress } = await run({
        authorizer: {
          initialAdmin: sdk.walletClient.account.address,
        },
        fundingManager: {
          orchestratorTokenAddress:
            '0x065775C7aB4E60ad1776A30DCfB15325d231Ce4F' as const,
        },
      })

      expect(orchestratorAddress).toContain('0x')
    },
    {
      timeout: 10_000, // 10 seconds
    }
  )

  it(
    '2. Should Listen For The Workflow Deployment',
    async () => {
      while (!id) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      expect(id).toContain('0x')
    },
    {
      timeout: 7_000, // 7 seconds
    }
  )
})
