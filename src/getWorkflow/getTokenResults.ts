import type { Hex } from 'viem'
import type { PopPublicClient, PopWalletClient } from '@/types'
import { ERC20_ABI, FM_BASE } from '@/utils'
import { getModule, Inverter } from '@'

export type GetWorkflowTokenResultsParams<
  W extends PopWalletClient | undefined = undefined,
> = {
  fundingManagerAddress: Hex
  publicClient: PopPublicClient
  walletClient?: W
  self?: Inverter<W>
}

export const getFundingTokenResults = async <
  W extends PopWalletClient | undefined = undefined,
>({
  fundingManagerAddress,
  publicClient,
  walletClient,
  self,
}: GetWorkflowTokenResultsParams<W>) => {
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
      extras: {
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

export const getIssuanceTokenResults = async <
  W extends PopWalletClient | undefined = undefined,
>({
  fundingManagerAddress,
  publicClient,
  walletClient,
  self,
}: GetWorkflowTokenResultsParams<W>) => {
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
      extras: {
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
