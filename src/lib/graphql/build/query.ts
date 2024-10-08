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

export const BondingCurve = (args: {
  params?: FormattedGraphQLParams<GQLBondingCurve>
  project: Array<keyof GQLBondingCurve>
}) => utils.queryWrapper({ name: 'BondingCurve', ...args })

export const LinearVesting = (args: {
  params?: FormattedGraphQLParams<GQLLinearVesting>
  project: Array<keyof GQLLinearVesting>
}) => utils.queryWrapper({ name: 'LinearVesting', ...args })

export const StreamingPaymentProcessor = (args: {
  params?: FormattedGraphQLParams<GQLStreamingPaymentProcessor>
  project: Array<keyof GQLStreamingPaymentProcessor>
}) => utils.queryWrapper({ name: 'StreamingPaymentProcessor', ...args })

export const Swap = (args: {
  params?: FormattedGraphQLParams<GQLSwap>
  project: Array<keyof GQLSwap>
}) => utils.queryWrapper({ name: 'Swap', ...args })

export const Workflow = (args: {
  params?: FormattedGraphQLParams<GQLWorkflow>
  project: Array<keyof GQLWorkflow>
}) => utils.queryWrapper({ name: 'Workflow', ...args })

export const WorkflowModule = (args: {
  params?: FormattedGraphQLParams<GQLWorkflowModule>
  project: Array<keyof GQLWorkflowModule>
}) => utils.queryWrapper({ name: 'WorkflowModule', ...args })

export const WorkflowModuleType = (args: {
  params?: FormattedGraphQLParams<GQLWorkflowModuleType>
  project: Array<keyof GQLWorkflowModuleType>
}) => utils.queryWrapper({ name: 'WorkflowModuleType', ...args })
