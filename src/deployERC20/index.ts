import { parseUnits } from 'viem'
import { ERC20_ABI, ERC20_BYTECODE } from '../utils/constants'
import type { DeployERC20Params } from '..'

export default async function ({
  name,
  symbol,
  decimals,
  initialSupply,
  walletClient,
  publicClient,
}: DeployERC20Params) {
  const parsedInitialSupply = parseUnits(initialSupply, decimals)

  // Encode the deployment data
  const deploymentData = {
    abi: ERC20_ABI,
    bytecode: ERC20_BYTECODE,
    args: [name, symbol, decimals, parsedInitialSupply],
  } as const

  // Deploy the contract
  const txHash = await walletClient.deployContract(deploymentData)

  // Wait for the transaction to be mined
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

  const result = {
    tokenAddress: receipt.contractAddress,
    transactionHash: txHash,
  }

  return result
}
