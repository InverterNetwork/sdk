import type {
  AuthorizerTemplateConfig,
  AutV2ModuleName,
} from '@inverter-network/abis'
import type { RequestedModules } from '@/index'
import { beforeEach, describe, expect, it } from 'bun:test'

import { defineAuthorizerTemplate } from '@/utils/template'

const templates_json: AuthorizerTemplateConfig<AutV2ModuleName>[] = [
  {
    name: 'OPEN_BOUNTY',
    module: 'LM_PC_Bounties_v2',
    roles: [],
    publicFunctions: ['addClaim'],
  },
]

const templates = templates_json.map((template) =>
  defineAuthorizerTemplate(template)
)

console.log(JSON.stringify(templates, null, 2))

describe('#DEPLOY_WORKFLOW_TEMPLATE_AUT', () => {
  // CONSTANTS
  // --------------------------------------------------
  // @ts-ignore - still in progress
  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_DepositVault_v1',
    paymentProcessor: 'PP_Simple_v1',
    optionalModules: ['LM_PC_Bounties_v2'],
  } as const satisfies RequestedModules

  // VARIABLES
  // --------------------------------------------------

  beforeEach(async () => {})

  it(`1. Should do something`, async () => {
    expect(true).toBe(true)
  })
})
