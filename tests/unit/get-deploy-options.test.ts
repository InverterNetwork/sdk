import type { FilterByPrefix } from '@'
import { data } from '@inverter-network/abis'
import { expect, describe, it } from 'bun:test'

import { sdk } from 'tests/helpers'

describe('#GET_DEPLOY_OPTIONS', () => {
  const rawAuthorizerOptions = data
    .map((i) => i.moduleType === 'authorizer' && i.name)
    .filter((i) => !!i)
  const rawFundingManagerOptions = data
    .map((i) => i.moduleType === 'fundingManager' && i.name)
    .filter((i) => !!i)
  const rawPaymentProcessorOptions = data
    .map((i) => i.moduleType === 'paymentProcessor' && i.name)
    .filter((i) => !!i)
  const rawOptionalModuleOptions = data
    .map((i) => i.moduleType === 'optionalModule' && i.name)
    .filter((i) => !!i)

  const rawCustomFactoryFundManagerOptions = rawFundingManagerOptions.filter(
    (i): i is FilterByPrefix<typeof i, 'FM_BC'> => i.startsWith('FM_BC')
  )

  it('1. Match Default Available Options', async () => {
    const options = sdk.getDeployOptions()

    expect(options.authorizer).toEqual(rawAuthorizerOptions)
    expect(options.fundingManager).toEqual(rawFundingManagerOptions)
    expect(options.paymentProcessor).toEqual(rawPaymentProcessorOptions)
    expect(options.optionalModules).toEqual(rawOptionalModuleOptions)
  })

  it('2. Should Match Restricted PIM Factory Options', async () => {
    const options = sdk.getDeployOptions('restricted-pim')

    expect(options.authorizer).toEqual(rawAuthorizerOptions)
    expect(options.fundingManager).toEqual(rawCustomFactoryFundManagerOptions)
    expect(options.paymentProcessor).toEqual(rawPaymentProcessorOptions)
    expect(options.optionalModules).toEqual(rawOptionalModuleOptions)
  })

  it('3. Should Match Immutable PIM Factory Options', async () => {
    const options = sdk.getDeployOptions('immutable-pim')

    expect(options.authorizer).toEqual(rawAuthorizerOptions)
    expect(options.fundingManager).toEqual(rawCustomFactoryFundManagerOptions)
    expect(options.paymentProcessor).toEqual(rawPaymentProcessorOptions)
    expect(options.optionalModules).toEqual(rawOptionalModuleOptions)
  })
})
