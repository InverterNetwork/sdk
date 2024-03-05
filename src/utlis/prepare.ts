import {
  ModuleKeys,
  ModuleVersion,
  ModuleVersionKey,
} from '@inverter-network/abis'
import formatMethod from './formatMethod'
import { Extras } from '../types/base'

export default function prepare<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
  T extends 'read' | 'write',
>(
  itterable: ModuleVersion<K, V>['itterable'],
  type: T,
  contract: any,
  extras?: Extras
) {
  type Result = {
    [N in Extract<
      (typeof itterable)[number],
      {
        type: T
      }
    >['name']]: ReturnType<typeof formatMethod<K, V, N>>
  }
  return itterable
    .filter((i) => i.type === type)
    .map((item) => formatMethod(item, contract, extras))
    .reduce((acc, item) => {
      acc[item.name] = item
      return acc
    }, {} as any) as Result
}
