import { AbiStateMutability } from 'viem'
import { Extras, GetMethodArgs, GetMethodResponse } from '../../types'
import formatOutputs from '../formatOutputs'
import parseInputs from '../parseInputs'

// Construct the run function
export default function <
  FormattedInputs,
  FormattedOutputs,
  StateMutability extends AbiStateMutability,
  Simulate extends boolean = false,
>(
  name: string,
  contract: any,
  stateMutability: StateMutability,
  formattedInputs: FormattedInputs,
  formattedOutputs: FormattedOutputs,
  extras?: Extras,
  simulate?: Simulate
) {
  // Check if the function is a read or write function
  const kind = ['view', 'pure'].includes(stateMutability) ? 'read' : 'write'

  const run = async (args: GetMethodArgs<typeof formattedInputs>) => {
    // Parse the inputs, from user input to contract input
    const parsedInputs = parseInputs(formattedInputs, args, extras)

    // Get the result from the contract, based on the kind and simulate params
    const res = await (() => {
      if (simulate) {
        if (!!extras?.walletAddress)
          return contract['simulate'][name](parsedInputs, {
            account: extras.walletAddress,
          })

        return contract['simulate'][name](parsedInputs)
      }

      return contract[kind][name](parsedInputs)
    })()

    // Format the outputs, from contract output to user output-
    // and pass the return type to type param
    const formattedRes = formatOutputs<
      GetMethodResponse<FormattedOutputs, StateMutability, Simulate>
    >(formattedOutputs, res, extras)

    return formattedRes
  }

  return run
}