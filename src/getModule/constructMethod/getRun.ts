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
import { decodeErrorResult, formatEther } from 'viem'

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
        throw handleError(contract.abi, e)
      }
    })()

    // Format the outputs, from contract output to user output-
    // and pass the return type to type param
    const formattedRes = await formatOutputs<Kind, FormattedOutputs>({
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

const handleError = (abi: any, error: any) => {
  if (!error?.message?.includes?.('Unable to decode signature')) return error
  const signature = error.cause.signature as `0x${string}`

  let errorName: string | undefined

  const abis = [abi]

  abis.forEach((i) => {
    try {
      const value = decodeErrorResult({
        abi: i,
        data: signature,
      })
      if (value.errorName) errorName = value.errorName
    } catch {
      // do nothing
    }
  })

  if (!errorName) return error

  return new Error(errorName)
}
