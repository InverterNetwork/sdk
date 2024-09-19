import { processInputs, formatOutputs, processAllowances } from '@/utils'
import { Inverter } from '@/Inverter'

import type {
  Extras,
  GetMethodArgs,
  PopPublicClient,
  PopWalletClient,
  MethodKind,
  GetMethodResponse,
  PopContractReturnType,
} from '@/types'
import { formatEther } from 'viem'
import { handleError } from '../../utils'
import type { ExtendedAbiParameter } from '@inverter-network/abis'

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

    /**
     * Resposne data based on the kind of method
     * catch and try decode the error
     */
    const res = await (async () => {
      try {
        if (kind !== 'read')
          await processAllowances({
            requiredAllowances,
            publicClient,
            walletClient,
          })

        const actions = {
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
          write: () => contract.write[name](processedInputs),
          read: () => contract.read[name](processedInputs),
          estimateGas: async () => {
            const value = await contract.estimateGas[name](processedInputs)
            const formatted = formatEther(value)
            const result = {
              value,
              formatted,
            }
            return result
          },
        }

        const selected = actions[kind]

        const res = (await selected()) as ReturnType<typeof selected>

        return res as any
      } catch (e: any) {
        throw handleError({ abi: contract.abi, error: e })
      }
    })()

    // If the kind is simulate, get the result from the result property
    const resByKind = kind === 'simulate' ? res.result : res

    // Format the outputs, from contract output to user output-
    // and pass the return type to type param
    const formattedRes = await formatOutputs({
      extendedOutputs,
      res: resByKind,
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
