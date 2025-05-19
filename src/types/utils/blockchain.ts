import type { Abi } from 'abitype'
import type {
  Account,
  Address,
  Chain,
  Client,
  GetContractReturnType,
  PublicClient,
  Transport,
  WalletClient,
} from 'viem'

export type PopPublicClient = PublicClient<Transport, Chain>
export type PopWalletClient = WalletClient<Transport, Chain, Account>

export type PopContractReturnType = GetContractReturnType<
  Abi,
  Client<Transport, Chain, Account>,
  Address
>
