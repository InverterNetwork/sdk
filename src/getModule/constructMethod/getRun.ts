import { processInputs, formatOutputs, ERC20_ABI } from '@/utils'
import { Inverter } from '@/Inverter'

import type {
  Extras,
  GetMethodArgs,
  PopPublicClient,
  PopWalletClient,
  RequiredAllowances,
  MethodKind,
  GetMethodResponse,
  PopContractReturnType,
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
  contract: PopContractReturnType
  extendedInputs: ExtenderInputs
  extendedOutputs: ExtendedOutputs
  walletClient?: PopWalletClient
  extras?: Extras
  kind: Kind
  self?: Inverter
}) {
  const run = async (
    args: GetMethodArgs<typeof extendedInputs>
  ): Promise<GetMethodResponse<ExtendedOutputs, Kind>> => {
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

    /**
     * Resposne data based on the kind of method
     * catch and try decode the error
     */
    const res = await (() => {
      try {
        const selectedRes = {
          simulate: async () => {
            // if no dependencies, run the simulate function
            const simRes = await contract.simulate[name](processedInputs, {
              // If extras has a wallet address, use it
              ...(extras?.walletAddress && {
                account: extras.walletAddress,
              }),
            })

            return simRes
          },
          write: async () => {
            if (hasDependencies)
              return await runWithDependencies({
                mainFunction: contract.write[name],
                mainArgs: processedInputs,
                requiredAllowances,
                publicClient,
                walletClient,
              })

            return await contract.write[name](processedInputs)
          },
          read: async () => {
            return await contract.read[name](processedInputs)
          },
          estimateGas: async () => {
            const value = await contract.estimateGas[name](processedInputs)
            const formatted = formatEther(value)
            const result = {
              value,
              formatted,
            }
            return result
          },
        }[kind]()

        return selectedRes
      } catch (e: any) {
        throw handleError({ abi: contract.abi, error: e })
      }
    })()

    // Format the outputs, from contract output to user output-
    // and pass the return type to type param
    const formattedRes = await formatOutputs({
      extendedOutputs,
      res,
      extras,
      publicClient,
      contract,
      self,
    })

    const result = {
      read: formattedRes,
      write: formattedRes,
      simulate: {
        result: formattedRes,
        request: res.request,
      },
      estimateGas: formattedRes,
    }[kind]

    return result
  }

  return run
}
