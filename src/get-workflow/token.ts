// external dependencies
import { ERC20_ABI, FM_BASE, getModule } from '@/index'
// sdk types
import type {
  GetWorkflowTokenParams,
  GetWorkflowTokenReturnType,
  PopWalletClient,
  WorkflowIssuanceToken,
  WorkflowToken,
} from '@/types'
import type { Hex } from 'viem'

/**
 * @description Get the funding token results
 * @template W - The wallet client
 * @param params - The parameters for the getFundingTokenResults function
 * @returns The funding token results
 */
export const getFundingToken = async <
  T extends WorkflowToken,
  W extends PopWalletClient | undefined = undefined,
  TUseTags extends boolean = true,
>({
  tokenType,
  fundingManagerAddress,
  publicClient,
  walletClient,
  self,
  useTags = true as TUseTags,
}: GetWorkflowTokenParams<T, W>): Promise<
  GetWorkflowTokenReturnType<T, W, TUseTags>
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
      name: tokenType,
      tagConfig: {
        decimals,
      },
      self,
      useTags,
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
 * @template TUseTags - Whether auto parse inputs, outputs and approve allowances using tag configs
 * @param params - The parameters for the getIssuanceTokenResults function
 * @returns The issuance token results
 */
export const getIssuanceToken = async <
  IT extends WorkflowIssuanceToken,
  W extends PopWalletClient | undefined = undefined,
  TUseTags extends boolean = true,
>({
  tokenType,
  fundingManagerAddress,
  publicClient,
  walletClient,
  self,
  useTags,
}: GetWorkflowTokenParams<IT, W>): Promise<
  GetWorkflowTokenReturnType<IT, W, TUseTags>
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
      name: tokenType,
      tagConfig: {
        decimals,
      },
      self,
      useTags,
    })

  return {
    address,
    module,
    decimals,
    symbol,
  }
}

export default {
  getFundingToken,
  getIssuanceToken,
}
