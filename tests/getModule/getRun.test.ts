import { describe, it, beforeAll, expect } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
// import { setupBcWorkflow } from '../testHelpers/setupWorkflow'
import { deployedBcModule, iUSD } from '../getDeploy/args'
import getRun from '../../src/getModule/constructMethod/getRun'
import { getContract } from 'viem'
import { getModuleData } from '@inverter-network/abis'
import { TOKEN_DATA_ABI } from '../../src/utils/constants'
import { Extras, FormattedAbiParameter } from '../../src'

describe.skip('#getRun', () => {
  const { publicClient, walletClient } = getTestConnectors()
  const minAmountOut = '1'
  const depositAmount = '10000000000000000'

  // mint test tokens, reset allowance to zero
  beforeAll(async () => {
    const mintHash = await walletClient.writeContract({
      address: iUSD,
      abi: TOKEN_DATA_ABI,
      functionName: 'mint',
      account: walletClient.account,
      args: [
        walletClient.account.address,
        10000000000000000000000000000000000n,
      ],
    })
    await publicClient.waitForTransactionReceipt({
      hash: mintHash,
    })
    const hash = await walletClient.writeContract({
      address: iUSD,
      abi: TOKEN_DATA_ABI,
      functionName: 'approve',
      account: walletClient.account,
      args: [deployedBcModule, 0n],
    })
    await publicClient.waitForTransactionReceipt({
      hash,
    })
    const allowance = await publicClient.readContract({
      address: iUSD,
      abi: TOKEN_DATA_ABI,
      functionName: 'allowance',
      args: [walletClient.account.address, deployedBcModule],
    })
    expect(allowance).toEqual(0n)
    // console.log('new orchestrator:')
    // console.log(
    //   await setupBcWorkflow(publicClient, walletClient, {
    //     ...baseArgs,
    //     fundingManager: { ...bcArgs, acceptedToken: iUSD },
    //   })
    // )
  })

  describe('with approval', () => {
    const name = 'buy'
    const stateMutability = 'nonpayable'
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
    const formattedOutputs = [
      {
        name: 'txHash',
        type: 'bytes32',
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
      console.log('1')
      run([depositAmount, minAmountOut])
        .then((r) => {
          console.log('2')
          console.log(r)
        })
        .catch((e) => {
          console.log('3')
          console.log(e)
        })
      expect(await run([depositAmount, minAmountOut])).pass()
    })
  })
})
