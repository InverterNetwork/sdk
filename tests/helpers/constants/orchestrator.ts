export const GET_ORCHESTRATOR_ARGS = (
  independentUpdateAdmin: `0x${string}` | string = ''
) => {
  return independentUpdateAdmin
    ? ({
        independentUpdates: true,
        independentUpdateAdmin: independentUpdateAdmin as `0x${string}`,
      } as const)
    : ({
        independentUpdates: false,
        independentUpdateAdmin: '0x0000000000000000000000000000000000000000',
      } as const)
}
