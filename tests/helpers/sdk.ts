import { Inverter } from '@'
import { getTestConnectors } from './getTestConnectors'

const { publicClient, walletClient } = getTestConnectors()

export const sdk = new Inverter({ publicClient, walletClient })
