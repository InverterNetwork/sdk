import { AbiStateMutability } from 'viem'
import {
  Extras,
  GetMethodArgs,
  PopPublicClient,
  FormattedAbiParameter,
} from '../../types'
import formatOutputs from '../formatOutputs'
import parseInputs from '../../utils/parseInputs'

// Construct the run function
export default function getRun<
  FormattedInputs extends readonly FormattedAbiParameter[],
  FormattedOutputs extends readonly FormattedAbiParameter[],
  StateMutability extends AbiStateMutability,
  Simulate extends boolean = false,
>({
  publicClient,
  name,
  contract,
  stateMutability,
  formattedInputs,
  formattedOutputs,
  extras,
  simulate,
}: {
  publicClient: PopPublicClient
  name: string
  contract: any
  stateMutability: StateMutability
  formattedInputs: FormattedInputs
  formattedOutputs: FormattedOutputs
  extras?: Extras
  simulate?: Simulate
}) {
  // Check if the function is a read or write function
  const kind = ['view', 'pure'].includes(stateMutability) ? 'read' : 'write'

  const run = async (args: GetMethodArgs<typeof formattedInputs>) => {
    // Parse the inputs, from user input to contract input
    const { inputsWithDecimals } = await parseInputs({
      formattedInputs,
      args,
      extras,
      publicClient,
      contract,
    })

    // Get the result from the contract, based on the kind and simulate params
    const res = await (() => {
      // If simulate is true
      if (simulate) {
        // If extras has a wallet address, use it
        if (!!extras?.walletAddress)
          return contract['simulate'][name](inputsWithDecimals, {
            account: extras.walletAddress,
          })

        // Else, just use the parsed inputs
        return contract['simulate'][name](inputsWithDecimals)
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
