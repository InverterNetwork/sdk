import { PublicClient, Transport, Chain, WalletClient, Account } from 'viem'

export type PopPublicClient = PublicClient<Transport, Chain>
export type PopWalletClient = WalletClient<Transport, Chain, Account>
