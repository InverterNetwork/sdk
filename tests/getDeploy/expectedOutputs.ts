import { getModuleSchema } from '../../src/getDeploy/getInputs'

export const expectedBaseInputSchema = {
  orchestrator: getModuleSchema('OrchestratorFactory_v1'),
  fundingManager: getModuleSchema('FM_DepositVault_v1'),
  authorizer: getModuleSchema('AUT_Roles_v1'),
  paymentProcessor: getModuleSchema('PP_Simple_v1'),
} as const

export const expected_FM_BC_Restricted_BancorInputSchema = getModuleSchema(
  'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1'
)

export const expected_LM_PC_KPIRewarderInputSchema = getModuleSchema(
  'LM_PC_KPIRewarder_v1'
)
