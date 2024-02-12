import { AbiKeys, AbiVersionKeys, data } from '@inverter-network/abis'

export default function getAbiMethodMetas<
  A extends (typeof data)[AbiKeys][AbiVersionKeys]['abi'],
>(abi: A) {
  return abi
    .map((item) => {
      if (item.type !== 'function') return null

      const type: 'read' | 'write' =
          item.stateMutability === 'view' ||
          // @ts-expect-error abis are missing modules
          item.stateMutability === 'pure'
            ? 'read'
            : 'write',
        name = item.name,
        inputs = item.inputs.map(({ internalType, ...rest }) => rest),
        outputs = item.outputs.map(({ internalType, ...rest }) => rest)

      return { type, name, inputs, outputs }
    })
    .filter((i): i is NonNullable<typeof i> => i !== null)
}
