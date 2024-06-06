import { describe, it, beforeEach, expect } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { deployedBcModule, iUSD, deployedKpiModule } from '../getDeploy/args'
import getRun from '../../src/getModule/constructMethod/getRun'
import { getContract } from 'viem'
import { getModuleData } from '@inverter-network/abis'
import { TOKEN_DATA_ABI } from '../../src/utils/constants'
import { Extras, FormattedAbiParameter } from '../../src'
import { USDC_SEPOLIA } from '../../src/getDeploy/constants'

describe('#getRun', () => {
  const { publicClient, walletClient } = getTestConnectors()

  const minAmountOut = '1'
  const depositAmount = '1000000'
  const stateMutability = 'nonpayable'
  const formattedOutputs = [
    {
      name: 'txHash',
      type: 'bytes32',
    },
  ] as FormattedAbiParameter[]

  const resetState = async () => {
    console.log('Minting Tokens')
    const mintHash = await walletClient.writeContract({
      address: iUSD,
      abi: TOKEN_DATA_ABI,
      functionName: 'mint',
      account: walletClient.account,
      args: [
        walletClient.account.address,
        '1157920892373161954235709850086879078532699846656405640394575840079',
      ],
    })
    await publicClient.waitForTransactionReceipt({
      hash: mintHash,
    })
    console.log('Done')
    const hash = await walletClient.writeContract({
      address: iUSD,
      abi: TOKEN_DATA_ABI,
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
      address: iUSD,
      abi: TOKEN_DATA_ABI,
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
      const formattedInputs = [
        {
          name: '_depositAmount',
          type: 'uint256',
          description: 'The amount of collateral token depoisited.',
          tags: ['decimals', 'approval'],
          jsType: 'numberString',
        },
        {
          name: '_minAmountOut',
          type: 'uint256',
          description:
            'The minimum acceptable amount the user expects to receive from the transaction.',
          tags: ['decimals:external:indirect:getIssuanceToken'],
          jsType: 'numberString',
        },
      ] as FormattedAbiParameter[]
      const extras = {
        decimals: 6,
        walletAddress: walletClient.account.address,
        defaultToken: iUSD,
      } as Extras
      const { abi } = getModuleData('FM_BC_Bancor_Redeeming_VirtualSupply_v1')
      const contract = getContract({
        abi,
        address: deployedBcModule,
        client: walletClient,
      })

      it('returns the run function', async () => {
        const run = getRun({
          publicClient,
          walletClient,
          name,
          stateMutability,
          formattedInputs,
          formattedOutputs,
          extras,
          contract,
          simulate: false,
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
      const stateMutability = 'nonpayable'
      const formattedInputs = [
        {
          name: 'amount',
          type: 'uint256',
          description: ': how much token should be staked',
          tags: ['decimals:external:indirect:stakingToken', 'approval'],
          jsType: 'numberString',
        },
      ] as FormattedAbiParameter[]
      const extras = {
        decimals: 6,
        walletAddress: walletClient.account.address,
        defaultToken: USDC_SEPOLIA,
      } as Extras
      const { abi } = getModuleData('LM_PC_KPIRewarder_v1')
      const contract = getContract({
        abi,
        address: deployedKpiModule,
        client: walletClient,
      })

      it('returns a functional run method', async () => {
        const run = getRun({
          publicClient,
          walletClient,
          name,
          stateMutability,
          formattedInputs,
          formattedOutputs,
          extras,
          contract,
          simulate: false,
        })
        expect(await run([depositAmount])).pass()
      })
    })
  })
})
