import { parseUnits } from 'viem'
import type { DeployERC20Params } from '..'
import { bytecodes, getModuleData } from '@inverter-network/abis'

export default async function ({
  name,
  symbol,
  decimals,
  initialSupply,
  initialAdmin,
  walletClient,
  publicClient,
}: DeployERC20Params) {
  const parsedInitialSupply = parseUnits(initialSupply, decimals)

  // Deploy the contract
  const txHash = await walletClient.deployContract({
    abi: getModuleData('ERC20Issuance_v1').abi,
    bytecode: bytecodes.ERC20Issuance_v1,
    args: [name, symbol, decimals, parsedInitialSupply, initialAdmin],
  })

  // Wait for the transaction to be mined
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

  const result = {
    tokenAddress: receipt.contractAddress,
    transactionHash: txHash,
  }

  return result
}
