/**
 * @description The mandatory modules for a workflow
 */
export const MANDATORY_MODULES = [
  'authorizer',
  'paymentProcessor',
  'fundingManager',
] as const

/**
 * @description The deployments url used to get the deployments on supported chains
 */
export const DEPLOYMENTS_URL =
  'https://raw.githubusercontent.com/InverterNetwork/deployments/main/deployments' as const

/**
 * @description The metadata url used to deploy the contracts
 */
export const METADATA_URL =
  'https://github.com/InverterNetwork/contracts' as const
