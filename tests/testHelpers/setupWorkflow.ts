import { getDeploy } from '../../src'

import { type PublicClient } from 'viem'
import type { GetUserArgs, PopWalletClient, RequestedModules } from '../../src'

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

  const { run } = await getDeploy({
    publicClient,
    walletClient,
    requestedModules,
  })

  await run(args)
}

export const setupKpiWorkflow = async (
  publicClient: PublicClient,
  walletClient: PopWalletClient,
  args: GetUserArgs
) => {
  const requestedModules = {
    fundingManager: 'FM_Rebasing_v1',
    paymentProcessor: 'PP_Simple_v1',
    authorizer: 'AUT_Roles_v1',
    optionalModules: ['LM_PC_KPIRewarder_v1'],
  } as RequestedModules

  const { run } = await getDeploy({
    publicClient,
    walletClient,
    requestedModules,
  })

  return await run(args)
}
