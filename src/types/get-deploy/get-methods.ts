import type { Inverter } from '@/i-inverter'

import type { PublicClient, SimulateContractReturnType } from 'viem'
import type { FactoryType } from './generic'
import type { RequestedModules } from './requested'
import type { PopWalletClient } from '../utils'
import type { GetUserArgs, MethodOptions } from '@'

export type GetDeployWriteReturn = {
  transactionHash: `0x${string}`
  orchestratorAddress: `0x${string}`
}

export type GetDeploySimulateReturn = {
  result: `0x${string}`
  request: SimulateContractReturnType
}

export type GetDeployEstimateGasReturn = {
  value: string
  formatted: string
}

export type GetMethodsParams<
  T extends RequestedModules,
  FT extends FactoryType,
> = {
  requestedModules: T
  factoryType: FT
  publicClient: PublicClient
  walletClient: PopWalletClient
  self?: Inverter
}

export type GetMethodsReturnType<
  T extends RequestedModules,
  FT extends FactoryType,
  Args = GetUserArgs<T, FT>,
> = {
  run: (
    userArgs: Args,
    options?: MethodOptions
  ) => Promise<GetDeployWriteReturn>
  simulate: (userArgs: Args) => Promise<GetDeploySimulateReturn>
  estimateGas: (userArgs: Args) => Promise<GetDeployEstimateGasReturn>
}
