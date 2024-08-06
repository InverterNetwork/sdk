import { Inverter } from '../Inverter'

import type { ModuleName } from '@inverter-network/abis'
import type { Hex } from 'viem'
import type { Extras, PopPublicClient, PopWalletClient } from '../types'

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
