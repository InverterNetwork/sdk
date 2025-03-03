import type { MethodOptions } from '@/index'
import type { PublicClient } from 'viem'

const receipt = async ({
  hash,
  options,
  publicClient,
}: {
  hash: `0x${string}`
  publicClient: PublicClient
  options?: MethodOptions
}) => {
  // Post transaction hash, inform the user of the hash
  if (hash) options?.onHash?.(hash)

  // If the hash exists and the confirmations are greater than 0, wait for the transaction receipt
  if (
    hash &&
    typeof options?.confirmations === 'number' &&
    options.confirmations > 0
  ) {
    const transactionReceipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: options.confirmations,
    })

    // Post transaction receipt, inform the user of the receipt
    options?.onConfirmation?.(transactionReceipt)

    return transactionReceipt
  }

  return
}

export default {
  receipt,
}
