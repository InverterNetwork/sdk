import type { ModuleName } from '@inverter-network/abis'
import type { Hex } from 'viem'
import { Extras } from '../types/base'
import { PopPublicClient, PopWalletClient } from '../types'
import { Inverter } from '../Inverter'

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
