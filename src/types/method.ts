import { FormatParametersToPrimitiveTypes } from './parameter'

export type MethodArgs<I> = FormatParametersToPrimitiveTypes<I, 'inputs'>

export type MethodResult<O> = FormatParametersToPrimitiveTypes<O, 'outputs'>
