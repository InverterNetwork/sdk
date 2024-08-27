import { processInputs, formatOutputs, ERC20_ABI } from '@/utils'
import { Inverter } from '@/Inverter'

import type {
  Extras,
  GetMethodArgs,
  PopPublicClient,
  PopWalletClient,
  RequiredAllowances,
  MethodKind,
} from '@/types'
import { formatEther } from 'viem'
import { handleError } from '../../utils'
import type { ExtendedAbiParameter } from '@inverter-network/abis'

const runDependencies = async ({
  requiredAllowances,
  publicClient,
  walletClient,
}: {
  requiredAllowances: RequiredAllowances[]
  publicClient: PopPublicClient
  walletClient?: PopWalletClient
}) => {
  if (!walletClient) return
  const dependencyTxHashes = await Promise.all(
    requiredAllowances.map((requiredAllowance) => {
      return walletClient.writeContract({
        address: requiredAllowance.token,
        account: walletClient.account,
        functionName: 'approve',
        args: [requiredAllowance.spender, requiredAllowance.amount],
        abi: ERC20_ABI,
      })
    })
  )

  return await Promise.all(
    dependencyTxHashes.map((hash) => {
      return publicClient.waitForTransactionReceipt({ hash })
    })
  )
}

const runWithDependencies = async ({
  mainArgs,
  mainFunction,
  ...params
}: {
  mainFunction: any
  mainArgs: any
  requiredAllowances: RequiredAllowances[]
  publicClient: PopPublicClient
  walletClient?: PopWalletClient
}) => {
  await runDependencies(params)
  return mainFunction(mainArgs)
}

// Construct the run function
export default function getRun<
  ExtenderInputs extends readonly ExtendedAbiParameter[],
  ExtendedOutputs extends readonly ExtendedAbiParameter[],
  Kind extends MethodKind,
>({
  publicClient,
  walletClient,
  name,
  contract,
  extendedInputs,
  extendedOutputs,
  extras,
  kind,
  self,
}: {
  publicClient: PopPublicClient
  name: string
  contract: any
  extendedInputs: ExtenderInputs
  extendedOutputs: ExtendedOutputs
  walletClient?: PopWalletClient
  extras?: Extras
  kind: Kind
  self?: Inverter
}) {
  const run = async (args: GetMethodArgs<typeof extendedInputs>) => {
    // Parse the inputs, from user input to contract input
    const { processedInputs, requiredAllowances } = await processInputs({
      extendedInputs,
      args,
      extras,
      publicClient,
      walletClient,
      contract,
      self,
      kind,
    })

    const hasDependencies = requiredAllowances.find(
      (requiredAllowance) => requiredAllowance.amount > 0n
    )

    const estimateGas = async () => {
      const value = await contract['estimateGas'][name](processedInputs)
      const formatted = formatEther(value)
      const result = {
        value,
        formatted,
      }
      return result
    }

    // Get the result from the contract, based on the kind and simulate params
    const res = await (async () => {
      try {
        switch (kind) {
          case 'simulate':
            // if no dependencies, run the simulate function
            const simRes = await contract['simulate'][name](processedInputs, {
              // If extras has a wallet address, use it
              ...(extras?.walletAddress && {
                account: extras.walletAddress,
              }),
            })

            return simRes.result
          case 'write':
          case 'read':
            if (hasDependencies)
              return await runWithDependencies({
                mainFunction: contract[kind][name],
                mainArgs: processedInputs,
                requiredAllowances,
                publicClient,
                walletClient,
              })
            else return await contract[kind][name](processedInputs)
          case 'estimateGas':
            return await estimateGas()
        }
      } catch (e: any) {
        throw handleError({ abi: contract.abi, error: e })
      }
    })()

    // Format the outputs, from contract output to user output-
    // and pass the return type to type param
    const formattedRes = await formatOutputs<ExtendedOutputs, Kind>({
      extendedOutputs,
      res,
      extras,
      publicClient,
      contract,
      self,
    })

    return formattedRes
  }

  return run
}
