import type { Abi } from 'abitype'
import type {
  PublicClient,
  Transport,
  Chain,
  WalletClient,
  Account,
  GetContractReturnType,
  Client,
  Address,
} from 'viem'

export type PopPublicClient = PublicClient<Transport, Chain>
export type PopWalletClient = WalletClient<Transport, Chain, Account>

export type PopContractReturnType = GetContractReturnType<
  Abi,
  Client<Transport, Chain, Account>,
  Address
>
