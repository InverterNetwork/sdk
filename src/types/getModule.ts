import { Inverter } from '@/Inverter'

import type { ModuleName } from '@inverter-network/abis'
import type { Hex } from 'viem'
import type { Extras, PopPublicClient, PopWalletClient } from '@/types'
import type { getModule } from '@'

export type GetModuleParams<
  N extends ModuleName,
  W extends PopWalletClient | undefined = undefined,
> = {
  name: N
  address: Hex
  publicClient: PopPublicClient
  walletClient?: W
  extras?: Extras
  self?: Inverter<W>
}

export type GetModuleReturn<
  N extends ModuleName,
  W extends PopWalletClient | undefined = undefined,
> = ReturnType<typeof getModule<N, W>>
