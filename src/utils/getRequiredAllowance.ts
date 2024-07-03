import { PublicClient } from 'viem'
import { ERC20_ABI } from './constants'

export type GetRequiredAllowanceProps = {
  transferAmount: bigint
  spenderAddress: `0x${string}`
  publicClient: PublicClient
  tokenAddress?: `0x${string}`
  userAddress?: `0x${string}`
}

export default async function getRequiredAllowance({
  transferAmount,
  tokenAddress,
  spenderAddress,
  publicClient,
  userAddress,
}: GetRequiredAllowanceProps) {
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
