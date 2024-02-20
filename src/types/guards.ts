import { InputWithComponents } from './input'
import { OutputWithComponents } from './output'

export const isString = (value: unknown): value is string =>
  typeof value === 'string'

export const isInoutWithComponents = (
  value: object
): value is OutputWithComponents | InputWithComponents =>
  value.hasOwnProperty('components')
