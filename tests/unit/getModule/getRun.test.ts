import { describe, it, beforeEach, expect } from 'bun:test'

import { getContract, type Abi } from 'viem'
import { getModuleData } from '@inverter-network/abis'
import { ERC20_ABI, ERC20_MINTABLE_ABI } from '@'
import { USDC_SEPOLIA } from '@/getDeploy/constants'

import type { Extras, ExtendedAbiParameter } from '@/types'

import { getTestConnectors, TEST_ERC20_MOCK_ADDRESS } from 'tests/helpers'
import getRun from '@/getModule/constructMethod/getRun'

describe('#getRun', () => {
  const { publicClient, walletClient } = getTestConnectors()

  // TODO: Actually deploy these modules
  const deployedBcModule = '0x80f8493761a18d29fd77c131865f9cf62b15e62a'
  const deployedKpiModule = '0x80f8493761a18d29fd77c131865f9cf62b15e62a'

  const client = {
    wallet: walletClient,
    public: publicClient,
  }

  const minAmountOut = '1'
  const depositAmount = '1000000'
  const extendedOutputs = [
    {
      name: 'txHash',
      type: 'bytes32',
    },
  ] as ExtendedAbiParameter[]

  const resetState = async () => {
    console.log('Minting Tokens')
    const mintHash = await walletClient.writeContract({
      address: TEST_ERC20_MOCK_ADDRESS,
      abi: ERC20_MINTABLE_ABI,
      functionName: 'mint',
      account: walletClient.account,
      args: [
        walletClient.account.address,
        BigInt(
          '1157920892373161954235709850086879078532699846656405640394575840079'
        ),
      ],
    })
    await publicClient.waitForTransactionReceipt({
      hash: mintHash,
    })
    console.log('Done')
    const hash = await walletClient.writeContract({
      address: TEST_ERC20_MOCK_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'approve',
      account: walletClient.account,
      args: [deployedBcModule, 0n],
    })
    console.log('Resetting approvals to zero')
    await publicClient.waitForTransactionReceipt({
      hash,
    })
    console.log('DONE')
    const allowance = await publicClient.readContract({
      address: TEST_ERC20_MOCK_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [walletClient.account.address, deployedBcModule],
    })
    expect(allowance).toEqual(0n)
  }

  // Skipped because current deployment is misconfigured
  describe.skip('with FM_BC_Bancor_Redeeming_VirtualSupply_v1', () => {
    // mint test tokens, reset allowance to zero
    beforeEach(async () => {
      await resetState()
    })

    describe('with approval', () => {
      const name = 'buy'
      const extendedInputs = [
        {
          name: '_depositAmount',
          type: 'uint256',
          description: 'The amount of collateral token depoisited.',
          tags: ['decimals', 'approval'],
        },
        {
          name: '_minAmountOut',
          type: 'uint256',
          description:
            'The minimum acceptable amount the user expects to receive from the transaction.',
          tags: ['decimals:external:indirect:getIssuanceToken'],
        },
      ] as ExtendedAbiParameter[]
      const extras = {
        decimals: 6,
        walletAddress: walletClient.account.address,
        defaultToken: TEST_ERC20_MOCK_ADDRESS,
      } as Extras
      const { abi } = getModuleData('FM_BC_Bancor_Redeeming_VirtualSupply_v1')

      const contract = getContract({
        abi: abi as Abi,
        address: deployedBcModule,
        client,
      })

      it('returns the run function', async () => {
        const run = getRun({
          publicClient,
          walletClient,
          name,
          kind: 'write',
          extendedInputs,
          extendedOutputs,
          extras,
          contract,
        })

        expect(await run([depositAmount, minAmountOut])).pass()
      })
    })
  })

  // test takes ages, therefore not run per default
  describe.skip('with LM_PC_KPIRewarder_v1', () => {
    const { publicClient, walletClient } = getTestConnectors()

    beforeEach(async () => {
      await resetState()
    })

    describe('with approval', () => {
      const name = 'stake'
      const extendedInputs = [
        {
          name: 'amount',
          type: 'uint256',
          description: ': how much token should be staked',
          tags: ['decimals:external:indirect:stakingToken', 'approval'],
        },
      ] as ExtendedAbiParameter[]
      const extras = {
        decimals: 6,
        walletAddress: walletClient.account.address,
        defaultToken: USDC_SEPOLIA,
      } as Extras
      const { abi } = getModuleData('LM_PC_KPIRewarder_v1')

      const contract = getContract({
        abi: abi as Abi,
        address: deployedKpiModule,
        client,
      })

      it('returns a functional run method', async () => {
        const run = getRun({
          publicClient,
          walletClient,
          name,
          kind: 'write',
          extendedInputs,
          extendedOutputs,
          extras,
          contract,
        })
        expect(await run([depositAmount])).pass()
      })
    })
  })
})
