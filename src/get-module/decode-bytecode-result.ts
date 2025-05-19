import type {
  ExtendedAbiParameter,
  FormatBytecodeOutputsParams,
  FormatBytecodeOutputsReturnType,
} from '@/types'
import { formatOutputs } from '@/utils'
import { decodeFunctionResult } from 'viem'

export default function decodeBytecodeResult<
  TExtendedOutputs extends ExtendedAbiParameter[],
>({
  res,
  functionName,
  ...params
}: FormatBytecodeOutputsParams): FormatBytecodeOutputsReturnType<TExtendedOutputs> {
  const decoded = decodeFunctionResult({
    abi: params.contract.abi,
    data: res,
    functionName: functionName,
  })

  return formatOutputs({
    ...params,
    res: decoded,
  })
}
