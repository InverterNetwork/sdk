import { expect, describe, it } from 'bun:test'

import {
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_ORCHESTRATOR_ARGS,
  sdk,
  TEST_ERC20_MOCK_ADDRESS,
} from 'tests/helpers'
import type {
  GetDeployWorkflowArgs,
  MixedRequestedModules,
  ModuleData,
  Workflow,
} from '@/index'
import { decodeEventLog, parseAbiItem } from 'viem'

const AUT_Roles_v1 = {
  name: 'AUT_Roles_v1',
  description:
    'Provides a robust access control mechanism for managing roles and permissions across different modules within the Inverter Network, ensuring secure and controlled access to critical functionalities.',
  moduleType: 'authorizer',
  deploymentInputs: {
    configData: [
      {
        name: 'initialAdmin',
        type: 'address',
        description: 'The initial admin of the workflow',
      },
    ],
  },
  abi: [
    { inputs: [], name: 'AccessControlBadConfirmation', type: 'error' },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'bytes32', name: 'neededRole', type: 'bytes32' },
      ],
      name: 'AccessControlUnauthorizedAccount',
      type: 'error',
    },
    { inputs: [], name: 'InvalidInitialization', type: 'error' },
    {
      inputs: [{ internalType: 'string', name: 'funcSig', type: 'string' }],
      name: 'Module_OrchestratorCallbackFailed',
      type: 'error',
    },
    {
      inputs: [],
      name: 'Module__Authorizer__AdminRoleCannotBeEmpty',
      type: 'error',
    },
    {
      inputs: [],
      name: 'Module__Authorizer__InvalidInitialAdmin',
      type: 'error',
    },
    {
      inputs: [],
      name: 'Module__Authorizer__ModuleNotSelfManaged',
      type: 'error',
    },
    {
      inputs: [{ internalType: 'address', name: 'module', type: 'address' }],
      name: 'Module__Authorizer__NotActiveModule',
      type: 'error',
    },
    {
      inputs: [],
      name: 'Module__Authorizer__OrchestratorCannotHaveAdminRole',
      type: 'error',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'caller', type: 'address' },
      ],
      name: 'Module__CallerNotAuthorized',
      type: 'error',
    },
    { inputs: [], name: 'Module__InvalidAddress', type: 'error' },
    { inputs: [], name: 'Module__InvalidMetadata', type: 'error' },
    { inputs: [], name: 'Module__InvalidOrchestratorAddress', type: 'error' },
    { inputs: [], name: 'Module__OnlyCallableByOrchestrator', type: 'error' },
    {
      inputs: [],
      name: 'Module__OnlyCallableByPaymentClient',
      type: 'error',
    },
    { inputs: [], name: 'NotInitializing', type: 'error' },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint64',
          name: 'version',
          type: 'uint64',
        },
      ],
      name: 'Initialized',
      type: 'event',
      outputs: [],
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'parentOrchestrator',
          type: 'address',
          description:
            'The address of the {Orchestrator_v1} the module is linked to.',
        },
        {
          components: [
            {
              internalType: 'uint256',
              name: 'majorVersion',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'minorVersion',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'patchVersion',
              type: 'uint256',
            },
            { internalType: 'string', name: 'url', type: 'string' },
            { internalType: 'string', name: 'title', type: 'string' },
          ],
          indexed: false,
          internalType: 'struct IModule_v1.Metadata',
          name: 'metadata',
          type: 'tuple',
          description: 'The metadata of the module.',
        },
      ],
      name: 'ModuleInitialized',
      type: 'event',
      outputs: [],
      description: 'Module has been initialized.',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
      outputs: [],
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
      outputs: [],
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
      outputs: [],
    },
    {
      inputs: [],
      name: 'BURN_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '_0', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
      description:
        'The role that is used as a placeholder for a burned admin role.',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '_0', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The role to remove admin access from.',
        },
      ],
      name: 'burnAdminFromModuleRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Irreversibly burns the admin of a given role.',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The identifier of the role we want to check',
        },
        {
          internalType: 'address',
          name: 'who',
          type: 'address',
          description: 'The address on which to perform the check.',
        },
      ],
      name: 'checkForRole',
      outputs: [
        {
          internalType: 'bool',
          name: '_0',
          type: 'bool',
          description: 'bool Returns if the address holds the role',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      description:
        'Checks whether an address holds the required role to execute the current transaction.',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'module',
          type: 'address',
          description: 'The address of the module to generate the hash for.',
        },
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The ID number of the role to generate the hash for.',
        },
      ],
      name: 'generateRoleId',
      outputs: [
        {
          internalType: 'bytes32',
          name: '_0',
          type: 'bytes32',
          description: 'bytes32 Returns the generated role hash.',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
      description:
        'Helper function to generate a bytes32 role hash for a module role.',
    },
    {
      inputs: [],
      name: 'getAdminRole',
      outputs: [
        {
          internalType: 'bytes32',
          name: '_0',
          type: 'bytes32',
          description: 'The role ID.',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
      description: 'Returns the role ID of the admin role.',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '_0', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '_0', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '_0', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The role to grant.',
        },
        {
          internalType: 'address',
          name: 'target',
          type: 'address',
          description: 'The address to grant the role to.',
        },
      ],
      name: 'grantGlobalRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Grants a global role to a target.',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The role to grant.',
        },
        {
          internalType: 'address[]',
          name: 'targets',
          type: 'address[]',
          description: 'The addresses to grant the role to.',
        },
      ],
      name: 'grantGlobalRoleBatched',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Grants a global role to a set of targets.',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The role to grant.',
        },
        {
          internalType: 'address',
          name: 'target',
          type: 'address',
          description: 'The target address to grant the role to.',
        },
      ],
      name: 'grantModuleRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Grants a module role to a target address.',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The role to grant.',
        },
        {
          internalType: 'address[]',
          name: 'targets',
          type: 'address[]',
          description: 'The target addresses to grant the role to.',
        },
      ],
      name: 'grantModuleRoleBatched',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Grants a module role to multiple target addresses.',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The identifier of the role to grant.',
        },
        {
          internalType: 'address',
          name: 'target',
          type: 'address',
          description: 'The address to which to grant the role.',
        },
      ],
      name: 'grantRoleFromModule',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Used by a Module to grant a role to a user.',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The identifier of the role to grant.',
        },
        {
          internalType: 'address[]',
          name: 'targets',
          type: 'address[]',
          description: 'The addresses to which to grant the role.',
        },
      ],
      name: 'grantRoleFromModuleBatched',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Used by a Module to grant a role to a set of users.',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '_0', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'identifier',
      outputs: [
        {
          internalType: 'bytes32',
          name: '_0',
          type: 'bytes32',
          description: "The module's identifier.",
        },
      ],
      stateMutability: 'view',
      type: 'function',
      description: "Returns the module's identifier.",
    },
    {
      inputs: [
        {
          internalType: 'contract IOrchestrator_v1',
          name: 'orchestrator_',
          type: 'address',
        },
        {
          components: [
            {
              internalType: 'uint256',
              name: 'majorVersion',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'minorVersion',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'patchVersion',
              type: 'uint256',
            },
            { internalType: 'string', name: 'url', type: 'string' },
            { internalType: 'string', name: 'title', type: 'string' },
          ],
          internalType: 'struct IModule_v1.Metadata',
          name: 'metadata',
          type: 'tuple',
          description: "The module's metadata.",
        },
        {
          internalType: 'bytes',
          name: 'configData',
          type: 'bytes',
          description:
            'Variable config data for specific module implementations.',
        },
      ],
      name: 'init',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: "The module's initializer function.",
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'forwarder',
          type: 'address',
          description: 'The contract address to be verified.',
        },
      ],
      name: 'isTrustedForwarder',
      outputs: [
        {
          internalType: 'bool',
          name: '_0',
          type: 'bool',
          description: 'bool Is the given address the trusted forwarder.',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      description: 'Checks if the provided address is the trusted forwarder.',
    },
    {
      inputs: [],
      name: 'orchestrator',
      outputs: [
        {
          internalType: 'contract IOrchestrator_v1',
          name: '_0',
          type: 'address',
          description: "The module's {Orchestrator_1}.",
        },
      ],
      stateMutability: 'view',
      type: 'function',
      description:
        "Returns the module's {Orchestrator_v1} interface, {IOrchestrator_v1}.",
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        {
          internalType: 'address',
          name: 'callerConfirmation',
          type: 'address',
        },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The role to grant.',
        },
        {
          internalType: 'address',
          name: 'target',
          type: 'address',
          description: 'The address to grant the role to.',
        },
      ],
      name: 'revokeGlobalRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Revokes a global role from a target.',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The role to grant.',
        },
        {
          internalType: 'address[]',
          name: 'targets',
          type: 'address[]',
          description: 'The addresses to grant the role to.',
        },
      ],
      name: 'revokeGlobalRoleBatched',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Revokes a global role from a set of targets.',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The role to revoke.',
        },
        {
          internalType: 'address',
          name: 'target',
          type: 'address',
          description: 'The target address to revoke the role from.',
        },
      ],
      name: 'revokeModuleRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Revokes a module role from a target address.',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The role to revoke.',
        },
        {
          internalType: 'address[]',
          name: 'targets',
          type: 'address[]',
          description: 'The target addresses to revoke the role from.',
        },
      ],
      name: 'revokeModuleRoleBatched',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Revokes a module role from multiple target addresses.',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The identifier of the role to revoke.',
        },
        {
          internalType: 'address',
          name: 'target',
          type: 'address',
          description: 'The address to revoke the role from.',
        },
      ],
      name: 'revokeRoleFromModule',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Used by a Module to revoke a role from a user.',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
          description: 'The identifier of the role to revoke.',
        },
        {
          internalType: 'address[]',
          name: 'targets',
          type: 'address[]',
          description: 'The address to revoke the role from.',
        },
      ],
      name: 'revokeRoleFromModuleBatched',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Used by a Module to revoke a role from a set of users.',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '_0', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'title',
      outputs: [
        {
          internalType: 'string',
          name: '_0',
          type: 'string',
          description: "The module's title.",
        },
      ],
      stateMutability: 'view',
      type: 'function',
      description: "Returns the module's title.",
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'roleId',
          type: 'bytes32',
          description: 'The role on which to peform the admin transfer.',
        },
        {
          internalType: 'bytes32',
          name: 'newAdmin',
          type: 'bytes32',
          description: 'The new role to which to transfer admin access to.',
        },
      ],
      name: 'transferAdminRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      description: 'Transfer the admin rights to a given role.',
    },
    {
      inputs: [],
      name: 'trustedForwarder',
      outputs: [
        {
          internalType: 'address',
          name: '_0',
          type: 'address',
          description: 'address The trusted forwarder.',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      description: 'Returns the trusted forwarder.',
    },
    {
      inputs: [],
      name: 'url',
      outputs: [
        {
          internalType: 'string',
          name: '_0',
          type: 'string',
          description: "The module's URL.",
        },
      ],
      stateMutability: 'view',
      type: 'function',
      description: "Returns the module's URL.",
    },
    {
      inputs: [],
      name: 'version',
      outputs: [
        {
          internalType: 'uint256',
          name: '_0',
          type: 'uint256',
          description: "The module's major version.",
        },
        {
          internalType: 'uint256',
          name: '_1',
          type: 'uint256',
          description: "The module's minor version.",
        },
        {
          internalType: 'uint256',
          name: '_2',
          type: 'uint256',
          description: "The module's patch version.",
        },
      ],
      stateMutability: 'view',
      type: 'function',
      description: "Returns the module's version.",
    },
  ],
} as const satisfies ModuleData

describe('#WORKFLOW', () => {
  const deployer = sdk.walletClient.account.address

  describe('#BONDING_CURVE', () => {
    const requestedModules = {
      authorizer: AUT_Roles_v1,
      fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Streaming_v1',
    } as const satisfies MixedRequestedModules

    const args = {
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: FM_BC_Bancor_VirtualSupply_v1_ARGS,
      orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
    } as const satisfies GetDeployWorkflowArgs<typeof requestedModules>

    let orchestratorAddress: `0x${string}`
    let workflow: Workflow<typeof sdk.walletClient, typeof requestedModules>

    it('1. Should Deploy The Workflow', async () => {
      orchestratorAddress = (
        await (
          await sdk.deployWorkflow({
            requestedModules,
          })
        ).run(args)
      ).orchestratorAddress

      expect(orchestratorAddress).toContain('0x')
    })
    it('2. Should Get The Workflow', async () => {
      workflow = await sdk.getWorkflow({
        orchestratorAddress: orchestratorAddress,
        requestedModules,
      })
      expect(workflow).toBeObject()
    })
    it('3. Should Have: ( fundingToken & issuanceToken: address, module, decimals, symbol )', () => {
      expect(workflow.fundingToken).toContainKeys([
        'address',
        'module',
        'decimals',
        'symbol',
      ])

      expect(workflow.issuanceToken).toContainKeys([
        'address',
        'module',
        'decimals',
        'symbol',
      ])
    })
    it('4. Should Read The Static Price For Buying', async () => {
      const staticPriceForBuying =
        await workflow.fundingManager.read.getStaticPriceForBuying.run()
      expect(staticPriceForBuying).toBeString()
    })
  })

  describe('#BOUNTY_MANAGER', () => {
    const requestedModules = {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_DepositVault_v1',
      paymentProcessor: 'PP_Streaming_v1',
      optionalModules: ['LM_PC_Bounties_v1'],
    } as const satisfies MixedRequestedModules

    const args = {
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: {
        orchestratorTokenAddress: TEST_ERC20_MOCK_ADDRESS,
      },
      orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
    } as const satisfies GetDeployWorkflowArgs<typeof requestedModules>

    const bountyArgs = [
      '100',
      '1000',
      {
        message: 'Bounty for the first person to complete the task',
      },
    ] as const

    let bountyId: string
    let claimId: string

    let orchestratorAddress: `0x${string}`
    let workflow: Workflow<typeof sdk.walletClient, typeof requestedModules>

    it('1. Should Deploy The Workflow and Mint The Orchestrator Token', async () => {
      const testToken = sdk.getModule({
        address: TEST_ERC20_MOCK_ADDRESS,
        name: 'ERC20Issuance_v1',
        tagConfig: {
          decimals: 18,
        },
      })

      const mintHash = await testToken.write.mint.run([
        sdk.walletClient.account.address,
        '10000',
      ])

      orchestratorAddress = (
        await (
          await sdk.deployWorkflow({
            requestedModules,
          })
        ).run(args)
      ).orchestratorAddress

      expect(mintHash).toBeString()
      expect(orchestratorAddress).toContain('0x')
    })

    it('2. Should Get The Workflow', async () => {
      workflow = await sdk.getWorkflow({
        orchestratorAddress: orchestratorAddress,
        requestedModules,
      })
      expect(workflow).toBeObject()
    })

    it('3. Should Have: ( fundingToken: address, module, decimals, symbol )', async () => {
      expect(workflow.fundingToken).toContainKeys([
        'address',
        'module',
        'decimals',
        'symbol',
      ])
    })

    it('4. Should Grant Permission To Add Bounty, Add Claim, Verify Claim', async () => {
      const issuerRole =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.BOUNTY_ISSUER_ROLE.run()

      const issuerTxHash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.grantModuleRole.run(
          [issuerRole, sdk.walletClient.account.address]
        )

      const claimRole =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.CLAIMANT_ROLE.run()

      const claimTxHash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.grantModuleRole.run(
          [claimRole, sdk.walletClient.account.address]
        )

      const verifyRole =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.VERIFIER_ROLE.run()

      const verifyTxHash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.grantModuleRole.run(
          [verifyRole, sdk.walletClient.account.address]
        )

      expect(issuerTxHash).toBeString()
      expect(claimTxHash).toBeString()
      expect(verifyTxHash).toBeString()
    })

    it('5. Should Add A Bounty', async () => {
      const hash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.addBounty.run(
          bountyArgs,
          {
            confirmations: 1,
            onConfirmation: (receipt) => {
              // Define the ABI for the BountyAdded event
              const addBountyOutputAbi = parseAbiItem(
                'event BountyAdded(uint256 indexed bountyId, uint256 minimumPayoutAmount, uint256 maximumPayoutAmount, bytes details)'
              )

              // Decode the logs using the ABI
              const decodedLogs = decodeEventLog({
                abi: [addBountyOutputAbi],
                data: receipt.logs[0].data,
                topics: receipt.logs[0].topics,
              })

              // Retrieve the bountyId from the decoded logs
              bountyId = decodedLogs.args.bountyId.toString()
            },
          }
        )

      expect(bountyId.length).toBeGreaterThan(0)
      expect(hash).toBeString()
    })

    it('6. Should Read And Match The Bounty', async () => {
      const bounty =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.getBountyInformation.run(
          bountyId
        )

      expect(bountyArgs[0]).toEqual(<any>bounty.minimumPayoutAmount)
      expect(bountyArgs[1]).toEqual(<any>bounty.maximumPayoutAmount)
      expect(bountyArgs[2]).toEqual(bounty.details)
      expect(bountyArgs[2].message).toEqual(bounty.details.message)
    })

    it('7. Should Add A Claim', async () => {
      const hash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.addClaim.run(
          [
            bountyId,
            [{ addr: sdk.walletClient.account.address, claimAmount: '100' }],
            {
              claimUrl: 'https://www.google.com',
            },
          ],
          {
            confirmations: 1,
            onConfirmation: (receipt) => {
              const claimAddedAbi = parseAbiItem(
                'event ClaimAdded(uint256 indexed claimId,uint256 indexed bountyId,(address,uint256)[] contributors,bytes details)'
              )

              const decodedLogs = decodeEventLog({
                abi: [claimAddedAbi],
                data: receipt.logs[0].data,
                topics: receipt.logs[0].topics,
              })

              claimId = decodedLogs.args.claimId.toString()
            },
          }
        )

      expect(claimId.length).toBeGreaterThan(0)
      expect(hash).toBeString()
    })

    let contributors: readonly {
      addr: `0x${string}`
      claimAmount: string
    }[]

    it('8. Should Read The Claim', async () => {
      const claimInformation =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.getClaimInformation.run(
          claimId
        )

      contributors = claimInformation.contributors

      expect(claimInformation.bountyId).toEqual(bountyId)
    })

    it('9. Should Deposit To The Deposit Vault', async () => {
      const hash = await workflow.fundingManager.write.deposit.run('1000')

      expect(hash).toBeString()
    })

    it('10. Should Verify The Claim', async () => {
      const hash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.verifyClaim.run([
          claimId,
          contributors,
        ])

      expect(hash).toBeString()
    })
  })
})
