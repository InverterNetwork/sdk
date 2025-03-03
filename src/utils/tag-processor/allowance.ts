import type { TagProcessorAllowancesParams } from '@/index'
import { ERC20_ABI } from '../constants'

export default async function allowance({
  transferAmount,
  tokenAddress,
  spenderAddress,
  publicClient,
  userAddress,
}: TagProcessorAllowancesParams) {
  if (!tokenAddress || !userAddress)
    throw new Error(
      'Token or user address is undefined, while trying to get required allowance.'
    )

  const currentAllowance = <bigint>await publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [userAddress, spenderAddress],
  })

  return {
    amount: transferAmount > currentAllowance ? transferAmount : 0n,
    spender: spenderAddress,
    owner: userAddress,
    token: tokenAddress,
  }
}
