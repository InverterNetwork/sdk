// external dependencies
import type { ExtendedAbiParameter } from '@inverter-network/abis'
// sdk types
import type {
  GetMethodParams,
  GetMethodReturnType,
  GetModuleGetRunParams,
  MethodKind,
  MethodOptions,
} from '@/types'
// sdk utils
import {
  formatOutputs,
  handleError,
  handleOptions,
  processInputs,
  tagProcessor,
} from '@/utils'
import d from 'debug'
import { encodeFunctionData, formatEther } from 'viem'

const debug = d('inverter:get-module:get-run')

/**
 * @description Constructs the run function for a given method
 * @param params - The parameters for the run function
 * @returns The run function
 */
export default function getRun<
  ExtendedInputs extends readonly ExtendedAbiParameter[],
  ExtendedOutputs extends readonly ExtendedAbiParameter[],
  TMethodKind extends MethodKind,
>({
  publicClient,
  walletClient,
  name,
  contract,
  extendedInputs,
  extendedOutputs,
  tagConfig,
  kind,
  self,
}: GetModuleGetRunParams<ExtendedInputs, ExtendedOutputs, TMethodKind>) {
  /**
   * The run function of a kind of method
   * @param args The arguments of the method
   * @returns The response of the method
   */
  async function run(
    args: GetMethodParams<typeof extendedInputs>,
    options?: MethodOptions
  ): Promise<GetMethodReturnType<ExtendedOutputs, TMethodKind>> {
    // Parse the inputs, from user input to contract input
    const { processedInputs, requiredAllowances } = await processInputs({
      extendedInputs,
      args,
      tagConfig,
      publicClient,
      walletClient,
      contract,
      self,
      kind,
    })

    const actions = {
      // If the kind is simulate, use the simulate method
      simulate: async () => {
        const simRes = await contract.simulate[name](processedInputs, {
          // If tagConfig has a wallet address, use it
          ...(tagConfig?.walletAddress && {
            account: tagConfig.walletAddress,
          }),
        })

        return simRes
      },
      // If the kind is write, use the write method
      write: () =>
        contract.write[name](processedInputs, {
          // If options has a nonce, use it
          ...(options?.nonce ? { nonce: options.nonce } : {}),
        }),
      // If the kind is read, use the read method
      read: () => contract.read[name](processedInputs),
      // If the kind is estimateGas, use the estimateGas method
      estimateGas: async () => {
        const value = await contract.estimateGas[name](processedInputs)
        const formatted = formatEther(value)
        const result = {
          value,
          formatted,
        }
        return result
      },
      // If the kind is bytecode, use the bytecode method
      bytecode: () => {
        // For functions with no arguments, we should just return the function selector
        // This ensures proper calldata formatting for use in multicall

        const callData = encodeFunctionData({
          abi: contract.abi,
          functionName: name,
          args: processedInputs,
        })

        debug('BYTECODE CALL DATA', callData.slice(0, 100))

        return callData
      },
    }

    type Actions = typeof actions
    type AwaitedSimulationRes = Awaited<ReturnType<Actions['simulate']>>

    /**
     * Resposne data based on the kind of method
     * catch and try decode the error
     */
    const res: Awaited<ReturnType<Actions[TMethodKind]>> = await (async () => {
      try {
        // If the kind is not read, approve the required allowances
        if (
          !!requiredAllowances.length &&
          kind !== 'read' &&
          options?.skipApprove !== true
        ) {
          debug('Approving:', requiredAllowances)

          const transactionReceipts = await tagProcessor.approve({
            requiredAllowances,
            publicClient,
            walletClient,
          })

          debug(
            'Approve receipts:',
            transactionReceipts?.map(({ status, gasUsed }) => {
              return {
                status,
                gasUsed,
              }
            })
          )

          if (transactionReceipts) options?.onApprove?.(transactionReceipts)
        }

        // Select the action based on the kind and run it
        const res = await actions[kind]()

        // Return the response
        return res as any
      } catch (e: any) {
        throw handleError({ abi: contract.abi, error: e })
      }
    })()

    // If the kind is simulate, get the result from the result property
    const resByKind =
      kind === 'simulate' ? (res as AwaitedSimulationRes).result : res

    // Format the outputs, from contract output to user output-
    // and pass the return type to type param
    const formattedRes = await formatOutputs({
      extendedOutputs,
      res: resByKind,
      tagConfig,
      publicClient,
      contract,
      self,
    })

    // Assign the response based on the kind
    const result = {
      read: formattedRes,
      write: formattedRes,
      simulate: {
        result: formattedRes,
        request: (res as AwaitedSimulationRes).request,
      },
      estimateGas: formattedRes,
      bytecode: formattedRes,
    }[kind]

    // Apply options
    // Write options
    if (kind === 'write') {
      // Pre transaction receipt, inform the user of the hash
      await handleOptions.receipt({
        hash: formattedRes,
        options,
        publicClient,
      })
    }

    // Return the response
    return result
  }

  // Return the run function
  return run
}
