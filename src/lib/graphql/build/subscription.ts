import * as utils from '../utils'
import type { FormattedGraphQLParams } from '..'
import type {
  GQLBondingCurve,
  GQLLinearVesting,
  GQLStreamingPaymentProcessor,
  GQLSwap,
  GQLWorkflow,
  GQLWorkflowModule,
  GQLWorkflowModuleType,
} from './types'

export const BondingCurveSubscription = (args: {
  params?: FormattedGraphQLParams<GQLBondingCurve>
  project: Array<keyof GQLBondingCurve>
}) => utils.subscriptionWrapper({ name: 'BondingCurve', ...args })

export const LinearVestingSubscription = (args: {
  params?: FormattedGraphQLParams<GQLLinearVesting>
  project: Array<keyof GQLLinearVesting>
}) => utils.subscriptionWrapper({ name: 'LinearVesting', ...args })

export const StreamingPaymentProcessorSubscription = (args: {
  params?: FormattedGraphQLParams<GQLStreamingPaymentProcessor>
  project: Array<keyof GQLStreamingPaymentProcessor>
}) => utils.subscriptionWrapper({ name: 'StreamingPaymentProcessor', ...args })

export const SwapSubscription = (args: {
  params?: FormattedGraphQLParams<GQLSwap>
  project: Array<keyof GQLSwap>
}) => utils.subscriptionWrapper({ name: 'Swap', ...args })

export const WorkflowSubscription = (args: {
  params?: FormattedGraphQLParams<GQLWorkflow>
  project: Array<keyof GQLWorkflow>
}) => utils.subscriptionWrapper({ name: 'Workflow', ...args })

export const WorkflowModuleSubscription = (args: {
  params?: FormattedGraphQLParams<GQLWorkflowModule>
  project: Array<keyof GQLWorkflowModule>
}) => utils.subscriptionWrapper({ name: 'WorkflowModule', ...args })

export const WorkflowModuleTypeSubscription = (args: {
  params?: FormattedGraphQLParams<GQLWorkflowModuleType>
  project: Array<keyof GQLWorkflowModuleType>
}) => utils.subscriptionWrapper({ name: 'WorkflowModuleType', ...args })
