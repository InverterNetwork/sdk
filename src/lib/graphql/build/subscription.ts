import { utils } from '..'
import type { FormattedGraphQLParams } from '..'
import type {
  BondingCurve as TBondingCurve,
  LinearVesting as TLinearVesting,
  StreamingPaymentProcessor as TStreamingPaymentProcessor,
  Swap as TSwap,
  Workflow as TWorkflow,
  WorkflowModule as TWorkflowModule,
  WorkflowModuleType as TWorkflowModuleType,
} from './types'

export const BondingCurveSubscription = (args: {
  params?: FormattedGraphQLParams<TBondingCurve>
  project: Array<keyof TBondingCurve>
}) => utils.subscriptionWrapper({ name: 'BondingCurve', ...args })

export const LinearVestingSubscription = (args: {
  params?: FormattedGraphQLParams<TLinearVesting>
  project: Array<keyof TLinearVesting>
}) => utils.subscriptionWrapper({ name: 'LinearVesting', ...args })

export const StreamingPaymentProcessorSubscription = (args: {
  params?: FormattedGraphQLParams<TStreamingPaymentProcessor>
  project: Array<keyof TStreamingPaymentProcessor>
}) => utils.subscriptionWrapper({ name: 'StreamingPaymentProcessor', ...args })

export const SwapSubscription = (args: {
  params?: FormattedGraphQLParams<TSwap>
  project: Array<keyof TSwap>
}) => utils.subscriptionWrapper({ name: 'Swap', ...args })

export const WorkflowSubscription = (args: {
  params?: FormattedGraphQLParams<TWorkflow>
  project: Array<keyof TWorkflow>
}) => utils.subscriptionWrapper({ name: 'Workflow', ...args })

export const WorkflowModuleSubscription = (args: {
  params?: FormattedGraphQLParams<TWorkflowModule>
  project: Array<keyof TWorkflowModule>
}) => utils.subscriptionWrapper({ name: 'WorkflowModule', ...args })

export const WorkflowModuleTypeSubscription = (args: {
  params?: FormattedGraphQLParams<TWorkflowModuleType>
  project: Array<keyof TWorkflowModuleType>
}) => utils.subscriptionWrapper({ name: 'WorkflowModuleType', ...args })
