import {
  FunctionInput,
  FunctionInput_Indice,
  MethodKey,
  MethodMeta,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'

export default function test<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
  I extends FunctionInput_Indice<K, V, MK>,
>(input: FunctionInput<K, V, MK, I>, methodMeta: MethodMeta<K, V, MK>) {
  type MM = typeof methodMeta
  const { descriptions, tags } = methodMeta
  if (input.type === 'tuple[]') {
    const { name, type, components } = input

    const tag = (
        tags as Extract<MM['tags'], { [key in typeof name]: string }>
      )?.[name],
      description = (
        descriptions as Extract<
          MM['descriptions'],
          { [key in typeof name]: string }
        >
      )?.[name]

    return {
      name,
      type,
      tag,
      description,
      components: components.map((component) => {
        const { name, type } = component
        const tag = (
            tags as Extract<MM['tags'], { [key in typeof name]: string }>
          )?.[name],
          description = (
            descriptions as Extract<
              MM['descriptions'],
              { [key in typeof name]: string }
            >
          )?.[name]

        return {
          name,
          type,
          tag,
          description,
        }
      }),
    }
  }

  const { name, type } = input

  const tag = (tags as Extract<MM['tags'], { [key in typeof name]: string }>)?.[
      name
    ],
    description = (
      descriptions as Extract<
        MM['descriptions'],
        { [key in typeof name]: string }
      >
    )?.[name]

  return {
    name,
    type,
    tag,
    description,
  }
}

// const nonComponentInput = <
//   K extends ModuleKeys,
//   V extends ModuleVersionKeys,
//   MK extends MethodKey<K, V>,
// >(
//   input: unknown,
//   methodMeta: MethodMeta<K, V, MK>
// ) => {
//   type MM = typeof methodMeta
//   const { descriptions, tags } = methodMeta
//   const { name, type } = input as NonComponentInput<K, V, MK>

//   const tag = (tags as Extract<MM['tags'], { [key in typeof name]: string }>)?.[
//       name
//     ],
//     description = (
//       descriptions as Extract<
//         MM['descriptions'],
//         { [key in typeof name]: string }
//       >
//     )?.[name]

//   return {
//     name,
//     type,
//     tag,
//     description,
//   }
// }

// export const inputWithComponents = <
//   K extends ModuleKeys,
//   V extends ModuleVersionKeys,
//   MK extends MethodKey<K, V>,
// >(
//   input: unknown,
//   methodMeta: MethodMeta<K, V, MK>
// ) => {
//   type MM = typeof methodMeta
//   const { descriptions, tags } = methodMeta
//   const { name, type, components } = input as InputWithComponents<K, V, MK>

//   const tag = (tags as Extract<MM['tags'], { [key in typeof name]: string }>)?.[
//       name
//     ],
//     description = (
//       descriptions as Extract<
//         MM['descriptions'],
//         { [key in typeof name]: string }
//       >
//     )?.[name]

//   return {
//     name,
//     type,
//     tag,
//     description,
//     components: components.map((component) => {
//       const { name, type } = component
//       const tag = (
//           tags as Extract<MM['tags'], { [key in typeof name]: string }>
//         )?.[name],
//         description = (
//           descriptions as Extract<
//             MM['descriptions'],
//             { [key in typeof name]: string }
//           >
//         )?.[name]

//       return {
//         name,
//         type,
//         tag,
//         description,
//       }
//     }),
//   }
// }

// export type Decipher<
//   K extends ModuleKeys,
//   V extends ModuleVersionKeys,
//   MK extends MethodKey<K, V>,
// > = ReturnType<typeof useDecipher<K, V, MK>>

// function entriesFromObject<T extends object>(object: T): Entries<T> {
//   return Object.entries(object) as Entries<T>
// }
