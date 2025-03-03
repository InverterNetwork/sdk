import type { TagProcessorApproveParams } from '@/types'
import { ERC20_ABI } from '../constants'

export default async function approve({
  requiredAllowances,
  publicClient,
  walletClient,
}: TagProcessorApproveParams) {
  if (!walletClient) return

  const hasDependencies = requiredAllowances.find(
    (requiredAllowance) => requiredAllowance.amount > 0n
  )

  if (!hasDependencies) return

  const dependencyTxHashes = await Promise.all(
    requiredAllowances.map((requiredAllowance) => {
      return walletClient.writeContract({
        address: requiredAllowance.token,
        account: walletClient.account,
        functionName: 'approve',
        args: [requiredAllowance.spender, requiredAllowance.amount],
        abi: ERC20_ABI,
      })
    })
  )

  const receipts = await Promise.all(
    dependencyTxHashes.map((hash) => {
      return publicClient.waitForTransactionReceipt({ hash })
    })
  )

  return receipts
}
