import { AbiStateMutability } from 'viem'
import {
  Extras,
  GetMethodArgs,
  PopPublicClient,
  FormattedAbiParameter,
  PopWalletClient,
} from '../../types'
import formatOutputs from '../formatOutputs'
import parseInputs from '../../utils/processInputs'
import { TOKEN_DATA_ABI } from '../../utils/constants'
import { RequiredAllowances } from '../../types'
import { InverterSDK } from '../../InverterSDK'

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
        abi: TOKEN_DATA_ABI,
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
  StateMutability extends AbiStateMutability,
  Simulate extends boolean = false,
>({
  publicClient,
  walletClient,
  name,
  contract,
  stateMutability,
  formattedInputs,
  formattedOutputs,
  extras,
  simulate,
  self,
}: {
  publicClient: PopPublicClient
  name: string
  contract: any
  stateMutability: StateMutability
  formattedInputs: FormattedInputs
  formattedOutputs: FormattedOutputs
  walletClient?: PopWalletClient
  extras?: Extras
  simulate?: Simulate
  self?: InverterSDK
}) {
  // Check if the function is a read or write function
  const kind = ['view', 'pure'].includes(stateMutability) ? 'read' : 'write'

  const run = async (args: GetMethodArgs<typeof formattedInputs>) => {
    // Parse the inputs, from user input to contract input
    const { inputsWithDecimals, requiredAllowances } = await parseInputs({
      formattedInputs,
      args,
      extras,
      publicClient,
      walletClient,
      contract,
      self,
    })

    const hasDependencies = requiredAllowances.find(
      (requiredAllowance) => requiredAllowance.amount > 0n
    )

    // Get the result from the contract, based on the kind and simulate params
    const res = await (() => {
      // If simulate is true
      if (simulate && !hasDependencies) {
        // If extras has a wallet address, use it
        if (!!extras?.walletAddress)
          return contract['simulate'][name](inputsWithDecimals, {
            account: extras.walletAddress,
          })

        // Else, just use the parsed inputs
        return contract['simulate'][name](inputsWithDecimals)
      }

      if (hasDependencies) {
        return runWithDependencies(
          contract[kind][name],
          inputsWithDecimals,
          requiredAllowances,
          publicClient,
          walletClient
        )
      }

      // defaults to non simulate, read or write function
      return contract[kind][name](inputsWithDecimals)
    })()

    // Format the outputs, from contract output to user output-
    // and pass the return type to type param
    const formattedRes = formatOutputs<
      StateMutability,
      Simulate,
      FormattedOutputs
    >(formattedOutputs, res, extras)

    return formattedRes
  }

  return run
}
