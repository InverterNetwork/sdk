import { PublicClient } from 'viem'
import { GetUserArgs, PopWalletClient, getDeploy } from '../../src'

export const setupBcWorkflow = async (
  publicClient: PublicClient,
  walletClient: PopWalletClient,
  args: GetUserArgs
) => {
  const requestedModules = {
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    paymentProcessor: 'PP_Simple_v1',
    authorizer: 'AUT_Roles_v1',
  } as const

  const { run } = await getDeploy(publicClient, walletClient, requestedModules)

  await run(args)
}
