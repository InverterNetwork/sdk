import { Prepared } from '../utlis/prepare'

export type PreparedInput = Exclude<Prepared, { description: object }>
