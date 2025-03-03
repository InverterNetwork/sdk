// external dependencies
import type { Hex } from 'viem'

// sdk types
import type {
  GetWorkflowTokenResultParams,
  GetWorkflowTokenResultReturnType,
  PopWalletClient,
} from '@/types'

import { getModule, ERC20_ABI, FM_BASE } from '@/index'

/**
 * @description Get the funding token results
 * @template W - The wallet client
 * @param params - The parameters for the getFundingTokenResults function
 * @returns The funding token results
 */
export const getFundingTokenResults = async <
  W extends PopWalletClient | undefined = undefined,
>({
  fundingManagerAddress,
  publicClient,
  walletClient,
  self,
}: GetWorkflowTokenResultParams<W>): Promise<
  GetWorkflowTokenResultReturnType<'ERC20', W>
> => {
  const { readContract } = publicClient

  const address = <Hex>await readContract({
      address: fundingManagerAddress,
      abi: FM_BASE,
      functionName: 'token',
    }),
    decimals = <number>await readContract({
      address,
      abi: ERC20_ABI,
      functionName: 'decimals',
    }),
    symbol = <string>await readContract({
      address,
      abi: ERC20_ABI,
      functionName: 'symbol',
    }),
    module = getModule({
      publicClient,
      walletClient,
      address,
      name: 'ERC20',
      tagConfig: {
        decimals,
      },
      self,
    })

  return {
    address,
    module,
    decimals,
    symbol,
  }
}

/**
 * @description Get the issuance token results
 * @template W - The wallet client
 * @param params - The parameters for the getIssuanceTokenResults function
 * @returns The issuance token results
 */
export const getIssuanceTokenResults = async <
  W extends PopWalletClient | undefined = undefined,
>({
  fundingManagerAddress,
  publicClient,
  walletClient,
  self,
}: GetWorkflowTokenResultParams<W>): Promise<
  GetWorkflowTokenResultReturnType<'ERC20Issuance_v1', W>
> => {
  const { readContract } = publicClient

  const address = <Hex>await readContract({
      address: fundingManagerAddress,
      abi: FM_BASE,
      functionName: 'getIssuanceToken',
    }),
    decimals = <number>await readContract({
      address,
      abi: ERC20_ABI,
      functionName: 'decimals',
    }),
    symbol = <string>await readContract({
      address,
      abi: ERC20_ABI,
      functionName: 'symbol',
    }),
    module = getModule({
      publicClient,
      walletClient,
      address,
      name: 'ERC20Issuance_v1',
      tagConfig: {
        decimals,
      },
      self,
    })

  return {
    address,
    module,
    decimals,
    symbol,
  }
}

export default {
  getFundingTokenResults,
  getIssuanceTokenResults,
}
