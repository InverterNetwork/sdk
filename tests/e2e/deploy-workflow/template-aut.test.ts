import type {
  AuthorizerTemplateConfig,
  AutV2ModuleName,
} from '@inverter-network/abis'
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

describe('#DEFINE_AUTHORIZER_TEMPLATE', () => {
  // CONSTANTS
  // --------------------------------------------------
  const templates = templates_json.map((template) =>
    defineAuthorizerTemplate(template)
  )

  console.log(templates)

  // VARIABLES
  // --------------------------------------------------

  beforeEach(async () => {})

  it(`1. Should do something`, async () => {
    expect(true).toBe(true)
  })
})
