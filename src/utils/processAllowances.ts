import type {
  PopPublicClient,
  PopWalletClient,
  RequiredAllowances,
} from '@/types'
import { ERC20_ABI } from './constants'

export const processAllowances = async ({
  requiredAllowances,
  publicClient,
  walletClient,
}: {
  requiredAllowances: RequiredAllowances[]
  publicClient: PopPublicClient
  walletClient?: PopWalletClient
}) => {
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

  return await Promise.all(
    dependencyTxHashes.map((hash) => {
      return publicClient.waitForTransactionReceipt({ hash })
    })
  )
}
