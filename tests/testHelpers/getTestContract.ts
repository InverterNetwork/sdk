import { PublicClient, getContract, WalletClient } from "viem"
import { ERC20_ABI } from "../../src"


export const getToken = (token: `0x${string}`, publicClient: PublicClient, walletClient: WalletClient) => {
    return getContract({
        address: token,
        abi: ERC20_ABI,
        client: {public: publicClient, wallet: walletClient}
    })
}