import formatOutputs from '../formatOutputs'
import processInputs from '../../utils/processInputs'
import { ERC20_ABI } from '../../utils/constants'
import { Inverter } from '../../Inverter'

import type {
  Extras,
  GetMethodArgs,
  PopPublicClient,
  FormattedAbiParameter,
  PopWalletClient,
  RequiredAllowances,
  MethodKind,
} from '../../types'
import { formatEther } from 'viem'

const runDependencies = async (
  requiredAllowances: RequiredAllowances[],
  publicClient: PopPublicClient,
  walletClient?: PopWalletClient
) => {
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

const runWithDependencies = async (
  mainFunction: any,
  mainArgs: any,
  requiredAllowances: RequiredAllowances[],
  publicClient: PopPublicClient,
  walletClient?: PopWalletClient
) => {
  await runDependencies(requiredAllowances, publicClient, walletClient)
  return mainFunction(mainArgs)
}

// Construct the run function
export default function getRun<
  FormattedInputs extends readonly FormattedAbiParameter[],
  FormattedOutputs extends readonly FormattedAbiParameter[],
  Kind extends MethodKind,
>({
  publicClient,
  walletClient,
  name,
  contract,
  formattedInputs,
  formattedOutputs,
  extras,
  kind,
  self,
}: {
  publicClient: PopPublicClient
  name: string
  contract: any
  formattedInputs: FormattedInputs
  formattedOutputs: FormattedOutputs
  walletClient?: PopWalletClient
  extras?: Extras
  kind: Kind
  self?: Inverter
}) {
  const run = async (args: GetMethodArgs<typeof formattedInputs>) => {
    // Parse the inputs, from user input to contract input
    const { processedInputs, requiredAllowances } = await processInputs({
      formattedInputs,
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

    // Get the result from the contract, based on the kind and simulate params
    const res = await (async () => {
      switch (kind) {
        case 'simulate':
          // if no dependencies, run the simulate function
          if (!hasDependencies) {
            return await contract['simulate'][name](processedInputs, {
              // If extras has a wallet address, use it
              ...(extras?.walletAddress && {
                account: extras.walletAddress,
              }),
            })
          }
          break
        case 'write':
        case 'read':
          if (hasDependencies)
            return await runWithDependencies(
              contract[kind][name],
              processedInputs,
              requiredAllowances,
              publicClient,
              walletClient
            )
          else return contract[kind][name](processedInputs)
        case 'estimateGas':
          const value = await contract['estimateGas'][name](processedInputs)

          const formatted = formatEther(value)

          return {
            formatted,
            value,
          }
      }
    })()

    // Format the outputs, from contract output to user output-
    // and pass the return type to type param
    const formattedRes = formatOutputs<Kind, FormattedOutputs>({
      formattedOutputs,
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
