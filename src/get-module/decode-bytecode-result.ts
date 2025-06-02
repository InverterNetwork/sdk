import type {
  ExtendedAbiParameter,
  FormatBytecodeOutputsParams,
  FormatBytecodeOutputsReturnType,
} from '@/types'
import { formatOutputs } from '@/utils'
import { decodeFunctionResult } from 'viem'

export default function decodeBytecodeResult<
  TExtendedOutputs extends ExtendedAbiParameter[],
  TUseTags extends boolean = true,
>({
  res,
  functionName,
  useTags = true as TUseTags,
  ...params
}: FormatBytecodeOutputsParams<TUseTags>): FormatBytecodeOutputsReturnType<
  TExtendedOutputs,
  TUseTags
> {
  const decoded = decodeFunctionResult({
    abi: params.contract.abi,
    data: res,
    functionName: functionName,
  })

  if (useTags) {
    return formatOutputs({
      ...params,
      res: decoded,
    })
  }

  return decoded as any
}
