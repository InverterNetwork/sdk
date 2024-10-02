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

export const BondingCurve = (args: {
  params?: FormattedGraphQLParams<TBondingCurve>
  project: Array<keyof TBondingCurve>
}) => utils.queryWrapper({ name: 'BondingCurve', ...args })

export const LinearVesting = (args: {
  params?: FormattedGraphQLParams<TLinearVesting>
  project: Array<keyof TLinearVesting>
}) => utils.queryWrapper({ name: 'LinearVesting', ...args })

export const StreamingPaymentProcessor = (args: {
  params?: FormattedGraphQLParams<TStreamingPaymentProcessor>
  project: Array<keyof TStreamingPaymentProcessor>
}) => utils.queryWrapper({ name: 'StreamingPaymentProcessor', ...args })

export const Swap = (args: {
  params?: FormattedGraphQLParams<TSwap>
  project: Array<keyof TSwap>
}) => utils.queryWrapper({ name: 'Swap', ...args })

export const Workflow = (args: {
  params?: FormattedGraphQLParams<TWorkflow>
  project: Array<keyof TWorkflow>
}) => utils.queryWrapper({ name: 'Workflow', ...args })

export const WorkflowModule = (args: {
  params?: FormattedGraphQLParams<TWorkflowModule>
  project: Array<keyof TWorkflowModule>
}) => utils.queryWrapper({ name: 'WorkflowModule', ...args })

export const WorkflowModuleType = (args: {
  params?: FormattedGraphQLParams<TWorkflowModuleType>
  project: Array<keyof TWorkflowModuleType>
}) => utils.queryWrapper({ name: 'WorkflowModuleType', ...args })
