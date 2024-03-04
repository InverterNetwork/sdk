import { Tags } from '@inverter-network/abis'
import { AbiParameter } from 'abitype'
import { FormattedParametersToPrimitiveType as FormattedParametersToPrimitiveType } from './parameter'

export type FormatInputsReturn<Inputs> = {
  // 1. check if the input is a valid member of the tuple
  [K in keyof Inputs]: Inputs[K] extends AbiParameter & {
    tag?: Tags
  }
    ? // 2. check if the input is a decimal tag
      Inputs[K]['tag'] extends 'decimal'
      ? {
          name: Inputs[K]['name']
          tag: 'decimal'
          type: 'tuple'
          components: [
            {
              name: 'value'
              type: 'string'
            },
            {
              name: 'decimals'
              type: 'number'
            },
          ]
        }
      : // 3. check if the input is a any(string) tag
        Inputs[K]['tag'] extends 'any(string)'
        ? {
            name: Inputs[K]['name']
            tag: 'any(string)'
            type: 'any'
          }
        : // 4. check if the input is a tuple
          Inputs[K] extends {
              type: 'tuple[]'
              components: infer Components
            }
          ? // 5. if the input is a tuple, recursively call the FormatReturn type
            {
              name: Inputs[K]['name']
              type: Inputs[K]['type']
              components: FormatInputsReturn<Components>
            }
          : // 6. if non of the above, return the default input
            Inputs[K]
    : never
}

export type FormattedInputsToPrimitiveTypes<Inputs> =
  FormattedParametersToPrimitiveType<Inputs> extends infer R extends
    readonly unknown[]
    ? R['length'] extends 0
      ? void
      : R['length'] extends 1
        ? R[0]
        : R
    : never
