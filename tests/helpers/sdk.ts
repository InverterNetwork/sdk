import { Inverter } from '@/index'
import { getTestConnectors } from './get-test-connectors'

const { publicClient, walletClient } = getTestConnectors()

export const sdk = Inverter.getInstance({ publicClient, walletClient })
