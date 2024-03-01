// import { isAddress, parseUnits, stringToHex } from 'viem'
// import { isString } from '../types/guards'
import { MethodArgs } from '../types/method'
import { FormattedParameter } from '../types/parameter'

export default function parseInputs({
  inputs,
  // args,
}: {
  inputs: FormattedParameter[]
  args: MethodArgs<typeof inputs>
}) {
  // const parse = (input: FormattedParameter, values: any[]) => {
  //   switch (input.type) {
  //     case 'uint256':
  //       if (isString(value)) {
  //         if (input.tag === 'decimal' && !!tagValue)
  //           return parseUnits(value, tagValue)
  //         else BigInt(value)
  //       }
  //     case 'address':
  //       if (isString(value) && isAddress(value)) return value
  //     case 'bytes':
  //       if (input.tag === 'any(string)')
  //         return stringToHex(JSON.stringify(value))
  //   }
  // }

  // const parsedInputs = inputs.map((input) => {})
  return
}
