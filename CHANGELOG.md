# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.5.2](https://github.com/InverterNetwork/sdk/compare/v0.5.1...v0.5.2) (2025-05-23)


### Features

* **deploy-workflow:** introduce tagConfig parameter for enhanced workflow customization ([e7cf240](https://github.com/InverterNetwork/sdk/commit/e7cf240b63a19b9804137d4475cb05e1084fa5b0))
* **deploy:** enhance bytecode deployment with wallet client integration ([74e49d1](https://github.com/InverterNetwork/sdk/commit/74e49d147e4b86fbb49c189e7565d50c88203a97))
* **deploy:** implement contract deployment functions for enhanced workflow ([0ff60b2](https://github.com/InverterNetwork/sdk/commit/0ff60b2397cfc649ed7e1b9bf205e7409316796c))
* **documentation:** enhance JSDoc comments across multiple files for improved clarity ([7fe8dd3](https://github.com/InverterNetwork/sdk/commit/7fe8dd3abb02e7d14ae93f6b0b26f8431ca8c608))
* **get-simulated-workflow:** add bytecode and factory address to parameters ([6c957ee](https://github.com/InverterNetwork/sdk/commit/6c957eeb0da7ff735f96d96ca1b838260e698652))
* **get-simulated-workflow:** add detailed documentation and type definitions for getSimulatedWorkflow ([c983052](https://github.com/InverterNetwork/sdk/commit/c983052a7fd694acac98f10cdfad819a1f88a90d))
* **get-simulated-workflow:** enhance workflow simulation with token support and debug logging ([a64a718](https://github.com/InverterNetwork/sdk/commit/a64a718c94b55b9592a1454a2c28bc7b720d0051))
* **get-simulated-workflow:** implement and enhance getSimulatedWorkflow function ([f74c904](https://github.com/InverterNetwork/sdk/commit/f74c9046c2680d3710ba23a3eb10bf9cdcc2a3d5))
* **get-simulated-workflow:** integrate trusted forwarder address into return type ([a730201](https://github.com/InverterNetwork/sdk/commit/a7302016300f3513619d7d9b12bebbe86c4740cb))
* **get-simulated-workflow:** refactor to retrieve trusted forwarder address dynamically ([6dad067](https://github.com/InverterNetwork/sdk/commit/6dad06706de07221d25ecf4bf1d3ee777f1e4a8b))
* **index:** export multicall function from index.ts ([9d5c07d](https://github.com/InverterNetwork/sdk/commit/9d5c07d42b285acbb7a94b691829ad5f1dda8fdd))
* **inverter:** add multicall method for batch execution of module write methods ([69af87b](https://github.com/InverterNetwork/sdk/commit/69af87b8aea443b8b76aa872ff267326afd4dcb8))
* **multicall:** add debugging support and enhance bytecode handling ([78edeac](https://github.com/InverterNetwork/sdk/commit/78edeac324b8b24c88255c5b582e720085cffc18))
* **multicall:** add support for failed purchase calls in multicall tests ([0958490](https://github.com/InverterNetwork/sdk/commit/095849018d30a5f2f6c659739ff0b75c8c6d1509))
* **multicall:** add TRUSTED_FORWARDER_ADDRESS constant and clean up test setup ([424db2c](https://github.com/InverterNetwork/sdk/commit/424db2c9ac73e5a1e978fcf6d144726223226dc6))
* **multicall:** enhance multicall functionality with improved logging and return structure ([c518345](https://github.com/InverterNetwork/sdk/commit/c5183457bfac122db070fb0fa6ab9ceccd4bb582))
* **multicall:** enhance writeMulticall with error handling and options support ([46d6768](https://github.com/InverterNetwork/sdk/commit/46d6768beadb32bf4c36c23cec73a5f8bd86d89c))
* **multicall:** implement moduleMulticall for batch operations and refactor related components ([c3126fa](https://github.com/InverterNetwork/sdk/commit/c3126fa6c765c16983d94a3fbe6455414a658436))
* **multicall:** implement multicall functionality for batch transactions ([27c749d](https://github.com/InverterNetwork/sdk/commit/27c749dba1c61d95b558b8622d32b4fa2bd5e359))
* **multicall:** introduce bytecode handling in deploy workflow ([9410942](https://github.com/InverterNetwork/sdk/commit/941094299d16e4df4200ace91f7fc8cadd25c088))
* **multicall:** refactor multicall functionality to writeMulticall ([cbbc91d](https://github.com/InverterNetwork/sdk/commit/cbbc91dac53419451e82649e84bea1d5beaa46fc))
* **multicall:** update multicall method to return structured results ([bb751f9](https://github.com/InverterNetwork/sdk/commit/bb751f90818bcc0652ca71151e03e1c4db0cd975))
* **prettier:** add import sorting plugin and update configuration ([5060e24](https://github.com/InverterNetwork/sdk/commit/5060e248afcc3d262f3215b578330c839cbbf85e))
* **tests:** add end-to-end tests for multicall workflows ([acad95a](https://github.com/InverterNetwork/sdk/commit/acad95ad969baa0758864dbd9df0d5a668f06f68))
* **tests:** add end-to-end tests for one-click and simulate multicall workflows ([8b2286a](https://github.com/InverterNetwork/sdk/commit/8b2286ac22c7f3fecc93c38e47cb2e471400a90f))
* **tests:** add new e2e tests for deploy-workflow with various configurations ([7753fa9](https://github.com/InverterNetwork/sdk/commit/7753fa931afdad2c443c2ed27bfa430d45c724b7))


### Bug Fixes

* **deploy:** update default calls parameter to an empty array for consistency ([101e512](https://github.com/InverterNetwork/sdk/commit/101e512b991a935a763ab39d8d4585f195619c7d))
* **get-simulated-workflow:** correct logicModulesAddresses to logicModuleAddresses ([b667b9c](https://github.com/InverterNetwork/sdk/commit/b667b9c093e8076f870fd05e0414d7502a2bee8d))
* **multicall:** improve error handling and logging in writeMulticall function ([3d87e8a](https://github.com/InverterNetwork/sdk/commit/3d87e8a797e5f1b5d05bcbaa2c726b84d0f30a21))
* **multicall:** update skipApprove option in multicall test ([eae48b5](https://github.com/InverterNetwork/sdk/commit/eae48b52a03420cf51bc6f57e954aac936067b1a))
* **tag-processor:** enhance token address retrieval and decimals handling ([c4375e6](https://github.com/InverterNetwork/sdk/commit/c4375e65c984c9aed24f8ef13e181e028ee2e54e))

### [0.5.1](https://github.com/InverterNetwork/sdk/compare/v0.5.0...v0.5.1) (2025-05-14)


### Features

* **scripts:** add new utility scripts for deployment and logging ([aa716ad](https://github.com/InverterNetwork/sdk/commit/aa716ad1fb424c54f15be04f089904468b4f6981))


### Bug Fixes

* **scripts:** update script paths for consistency ([7bb2647](https://github.com/InverterNetwork/sdk/commit/7bb26477ff5c841e1e4c19a645f074244e2430f1))

## [0.5.0](https://github.com/InverterNetwork/sdk/compare/v0.5.0-alpha.4...v0.5.0) (2025-05-13)

## [0.5.0-alpha.0](https://github.com/InverterNetwork/sdk/compare/v0.4.4...v0.5.0-alpha.0) (2025-05-05)

### [0.4.4](https://github.com/InverterNetwork/sdk/compare/v0.4.3...v0.4.4) (2025-04-24)

### [0.4.3](https://github.com/InverterNetwork/sdk/compare/v0.4.2...v0.4.3) (2025-03-11)

### [0.4.2](https://github.com/InverterNetwork/sdk/compare/v0.4.1...v0.4.2) (2025-03-10)


### Features

* **workflow:** add support for custom token types ([2b6e341](https://github.com/InverterNetwork/sdk/commit/2b6e3416d8d22ce917ef48e71b81765fbaf9fadc))

### [0.4.1](https://github.com/InverterNetwork/sdk/compare/v0.4.0...v0.4.1) (2025-03-03)

## [0.4.0](https://github.com/InverterNetwork/sdk/compare/v0.4.0-alpha.12...v0.4.0) (2025-03-03)

## [0.4.0-alpha.0](https://github.com/InverterNetwork/sdk/compare/v0.3.18...v0.4.0-alpha.0) (2025-02-02)

### [0.3.18](https://github.com/InverterNetwork/sdk/compare/v0.3.17...v0.3.18) (2025-01-31)

### [0.3.17](https://github.com/InverterNetwork/sdk/compare/v0.3.16...v0.3.17) (2025-01-31)

### [0.3.16](https://github.com/InverterNetwork/sdk/compare/v0.3.15...v0.3.16) (2025-01-30)


### Features

* add issuance token address to workflow details ([e6407f2](https://github.com/InverterNetwork/sdk/commit/e6407f28f24397f44a3606acb56e2113aa3d1845))

### [0.3.15](https://github.com/InverterNetwork/sdk/compare/v0.3.14...v0.3.15) (2025-01-29)

### [0.3.14](https://github.com/InverterNetwork/sdk/compare/v0.3.13...v0.3.14) (2024-12-26)

### [0.3.13](https://github.com/InverterNetwork/sdk/compare/v0.3.12...v0.3.13) (2024-12-23)


### Bug Fixes

* chain names and time util ([3f8b634](https://github.com/InverterNetwork/sdk/commit/3f8b634a6a8009fbe21108d98bcdbe4f2f41256d))

### [0.3.12](https://github.com/InverterNetwork/sdk/compare/v0.3.11...v0.3.12) (2024-12-23)


### Bug Fixes

* missing export at utils ([673ee5d](https://github.com/InverterNetwork/sdk/commit/673ee5d1dd462e3e8cd45172eba8d7e15df32bb7))

### [0.3.11](https://github.com/InverterNetwork/sdk/compare/v0.3.10...v0.3.11) (2024-12-23)


### Features

* external utils ([f98b9d6](https://github.com/InverterNetwork/sdk/commit/f98b9d681767c0531f88c37696f426f35dac2193))

### [0.3.10](https://github.com/InverterNetwork/sdk/compare/v0.3.9...v0.3.10) (2024-12-20)

### [0.3.9](https://github.com/InverterNetwork/sdk/compare/v0.3.9-alpha.2...v0.3.9) (2024-12-18)

### [0.3.8](https://github.com/InverterNetwork/sdk/compare/v0.3.8-alpha.4...v0.3.8) (2024-12-10)

### [0.3.7](https://github.com/InverterNetwork/sdk/compare/v0.3.6...v0.3.7) (2024-10-30)

### [0.3.6](https://github.com/InverterNetwork/sdk/compare/v0.3.5...v0.3.6) (2024-10-26)


### Bug Fixes

* update workflow cache if wallet client is present or not ([739a3d2](https://github.com/InverterNetwork/sdk/commit/739a3d28bfeb6d14d37440dd51f82514a2bcd15f))

### [0.3.5](https://github.com/InverterNetwork/sdk/compare/v0.3.5-alpha.2...v0.3.5) (2024-10-26)

### [0.3.4](https://github.com/InverterNetwork/sdk/compare/v0.3.3...v0.3.4) (2024-10-19)


### Bug Fixes

* missing issuance token at default pim ([60284f2](https://github.com/InverterNetwork/sdk/commit/60284f29bb6e26cf9269fa944fca10e99cc63213))

### [0.3.3](https://github.com/InverterNetwork/sdk/compare/v0.3.2...v0.3.3) (2024-10-19)

### [0.3.2](https://github.com/InverterNetwork/sdk/compare/v0.3.1...v0.3.2) (2024-10-15)


### Bug Fixes

* excessive type dec at workflow tokens ([7cb7c97](https://github.com/InverterNetwork/sdk/commit/7cb7c972813206ec27a0b0cf660bf9d10f0fb58a))

### [0.3.1](https://github.com/InverterNetwork/sdk/compare/v0.3.0...v0.3.1) (2024-10-15)


### Bug Fixes

* named import of lodash ([cd94f53](https://github.com/InverterNetwork/sdk/commit/cd94f53599eda7615414811a3515b329087cfc59))

## [0.3.0](https://github.com/InverterNetwork/sdk/compare/v0.3.0-alpha.8...v0.3.0) (2024-10-14)

## [0.3.0-alpha.0](https://github.com/InverterNetwork/sdk/compare/v0.2.10...v0.3.0-alpha.0) (2024-10-02)

### Refactor

- deploy contract api has changed to be more flexible and type safe ([2068d9b](https://github.com/InverterNetwork/sdk/commit/2068d9bb5ec8912b35be46c3df5d41ab40c7550b))

### Features

- graphql ([3bf05a9](https://github.com/InverterNetwork/sdk/commit/3bf05a989f6d60f9a09f7f8a89b1f8dacdac3091))
- **wip:** graphql qr ([12a7d80](https://github.com/InverterNetwork/sdk/commit/12a7d80ccf34c78f1ce07af7d1ddb8e763fc78ee))
- **wip:** graphql subscriptions ([624101f](https://github.com/InverterNetwork/sdk/commit/624101f3b27aa0cb3a5e20f0a0f4742f43ed0eb5))

### Bug Fixes

- part of fr-231-feat-add-update-wallet-clients-to-class, add chainId keys to cache ([0b514e4](https://github.com/InverterNetwork/sdk/commit/0b514e48324194a5a546965e44bb0b6f4e129429))

### [0.2.10](https://github.com/InverterNetwork/sdk/compare/v0.2.9...v0.2.10) (2024-09-30)

### Features

- method options for module and getDeploy ([8e707f4](https://github.com/InverterNetwork/sdk/commit/8e707f42763edf32f4f35c164a1de91f460839a8))

### Bug Fixes

- overwrite applies to its tag ([ebf63e5](https://github.com/InverterNetwork/sdk/commit/ebf63e57d80608ea63081894f4633fca4dcc2cf8))
- redundant issuance token address on custom pim ([d72bd47](https://github.com/InverterNetwork/sdk/commit/d72bd47850082ee25fd6f9f2bf1e974d34869004))
- sim output wrong key ([6747cba](https://github.com/InverterNetwork/sdk/commit/6747cba7876f9afe5521ced61058cf6f846e4027))

### [0.2.9](https://github.com/InverterNetwork/sdk/compare/v0.2.8...v0.2.9) (2024-09-13)

### [0.2.8](https://github.com/InverterNetwork/sdk/compare/v0.2.7...v0.2.8) (2024-09-05)

### Bug Fixes

- esm support ([d9cecea](https://github.com/InverterNetwork/sdk/commit/d9cecea9975b7ce7365b6a09d2282f5de9d1b73a))

### [0.2.7](https://github.com/InverterNetwork/sdk/compare/v0.2.6...v0.2.7) (2024-09-02)

### [0.2.6](https://github.com/InverterNetwork/sdk/compare/v0.2.5...v0.2.6) (2024-09-01)

### [0.2.5](https://github.com/InverterNetwork/sdk/compare/v0.2.4...v0.2.5) (2024-08-27)

### Bug Fixes

- missing args type for custom factories ([ed24365](https://github.com/InverterNetwork/sdk/commit/ed24365150c61fdbea220bf1200382207d98ad54))

### [0.2.4](https://github.com/InverterNetwork/sdk/compare/v0.2.3...v0.2.4) (2024-08-26)

### Bug Fixes

- bigint array simple primitive ([0491481](https://github.com/InverterNetwork/sdk/commit/0491481043b9cfa978278355f7ec5b7ab6919117))
- tag primitive type util ([15554f6](https://github.com/InverterNetwork/sdk/commit/15554f659b8c206ff1f3c00b69f75f8c2f3cc485))

### [0.2.3](https://github.com/InverterNetwork/sdk/compare/v0.2.2...v0.2.3) (2024-08-26)

### [0.2.2](https://github.com/InverterNetwork/sdk/compare/v0.2.1...v0.2.2) (2024-08-23)

### Features

- immutable pim factory ([c811a17](https://github.com/InverterNetwork/sdk/commit/c811a17e86a8a2327215708ed7abf376a9834bd6))

### [0.2.1](https://github.com/InverterNetwork/sdk/compare/v0.2.0...v0.2.1) (2024-08-22)

### Features

- auto allowance at pim-factory ([2303f2d](https://github.com/InverterNetwork/sdk/commit/2303f2d539cc3e1892025b1369869a3914477e5f))

## [0.2.0](https://github.com/InverterNetwork/sdk/compare/v0.2.0-alpha.6...v0.2.0) (2024-08-21)

### [0.1.8](https://github.com/InverterNetwork/sdk/compare/v0.1.8-alpha.0...v0.1.8) (2024-08-12)

### [0.1.7](https://github.com/InverterNetwork/sdk/compare/v0.1.7-alpha.2...v0.1.7) (2024-08-07)

### Bug Fixes

- universal pkg mngr ([911623a](https://github.com/InverterNetwork/sdk/commit/911623af11860cc0fd2bd871b077a7ed814e458d))

### [0.1.6](https://github.com/InverterNetwork/sdk/compare/v0.1.5...v0.1.6) (2024-07-26)

### [0.1.5](https://github.com/InverterNetwork/sdk/compare/v0.1.3...v0.1.5) (2024-07-05)

### Bug Fixes

- caching function instead of decimals ([545756b](https://github.com/InverterNetwork/sdk/commit/545756be028c9a38672cfc052ba1cf1cd2359918))
- formula address & allowance amount calc ([b14ff2e](https://github.com/InverterNetwork/sdk/commit/b14ff2e4f6d835741e635ea7cdc436745020cb79))
- missing defaultToken and missing wC ( todo replace redun wC with extras userWallet ) ([be616ab](https://github.com/InverterNetwork/sdk/commit/be616ab11d55e9be395f68202585f2a8d289399f))

### [0.1.4](https://github.com/InverterNetwork/sdk/compare/v0.1.3...v0.1.4) (2024-07-04)

### Bug Fixes

- caching function instead of decimals ([545756b](https://github.com/InverterNetwork/sdk/commit/545756be028c9a38672cfc052ba1cf1cd2359918))
- formula address & allowance amount calc ([b14ff2e](https://github.com/InverterNetwork/sdk/commit/b14ff2e4f6d835741e635ea7cdc436745020cb79))
- missing defaultToken and missing wC ( todo replace redun wC with extras userWallet ) ([be616ab](https://github.com/InverterNetwork/sdk/commit/be616ab11d55e9be395f68202585f2a8d289399f))

### [0.1.3](https://github.com/InverterNetwork/sdk/compare/v0.1.2...v0.1.3) (2024-06-20)

### [0.1.2](https://github.com/InverterNetwork/sdk/compare/v0.1.1...v0.1.2) (2024-06-12)

### [0.1.1](https://github.com/InverterNetwork/sdk/compare/v0.1.0...v0.1.1) (2024-06-12)

### Bug Fixes

- un ordered tuple args ([b0710e6](https://github.com/InverterNetwork/sdk/commit/b0710e615247543ad7d22800adda8f6b340e0a3a))

## [0.1.0](https://github.com/InverterNetwork/sdk/compare/v0.1.0-beta.0...v0.1.0) (2024-06-11)

### [0.0.8](https://github.com/InverterNetwork/sdk/compare/v0.0.7...v0.0.8) (2024-04-29)

### Features

- tags ar array ([f4057e1](https://github.com/InverterNetwork/sdk/commit/f4057e1e123e759a005fd0cf671293ec47c51d92))

### [0.0.7](https://github.com/InverterNetwork/sdk/compare/v0.0.7-alpha.7...v0.0.7) (2024-04-24)

### [0.0.6](https://github.com/InverterNetwork/sdk/compare/v0.0.5...v0.0.6) (2024-04-07)

### [0.0.5](https://github.com/InverterNetwork/sdk/compare/v0.0.4...v0.0.5) (2024-03-19)

### [0.0.4](https://github.com/InverterNetwork/sdk/compare/v0.0.3...v0.0.4) (2024-03-19)

### Bug Fixes

- erc20 module missing extras ([af63d7e](https://github.com/InverterNetwork/sdk/commit/af63d7ea516b50fc39c8ac3116a7766353ce670c))

### [0.0.3](https://github.com/InverterNetwork/sdk/compare/v0.0.2...v0.0.3) (2024-03-19)

### [0.0.2](https://github.com/InverterNetwork/sdk/compare/v0.0.1...v0.0.2) (2024-03-13)

### [0.0.1](https://github.com/InverterNetwork/sdk/compare/v0.0.1-alpha.1...v0.0.1) (2024-03-08)

### 0.0.1-alpha.0 (2024-03-08)

### Features

- format outputs ([c33f0bc](https://github.com/InverterNetwork/sdk/commit/c33f0bcf5e6419dbfc637f10330bf0a83f5664e5))
- get workflow step 1 ([78a76ee](https://github.com/InverterNetwork/sdk/commit/78a76eec8ca3fc4c7b086c92ec26c931433652b9))
- mapped types ([bdcb0c7](https://github.com/InverterNetwork/sdk/commit/bdcb0c70c4aa5d3866d33cf3d2c45275c0d494bf))
- parse inputs ([d2cd09e](https://github.com/InverterNetwork/sdk/commit/d2cd09e13c6c1bb6ea6bdd40360836e60756893f))
- simulate ([d67541a](https://github.com/InverterNetwork/sdk/commit/d67541a269d617f32e82a04c4a951636eddc720c))
- simulate with address ([546c942](https://github.com/InverterNetwork/sdk/commit/546c9424ad8666551e95867feb51942531a8d94d))

### Bug Fixes

- map type index preserve ([9d94f28](https://github.com/InverterNetwork/sdk/commit/9d94f288cce83310e94bb04567dbeed99563da6f))
- tools dup var use ([91f35f0](https://github.com/InverterNetwork/sdk/commit/91f35f0a12240f8a7d32b52a51eab13cbba58cc6))

### [0.0.2](https://github.com/InverterNetwork/abis/compare/v0.0.1...v0.0.2) (2023-12-15)

### [0.0.1](https://github.com/InverterNetwork/abis/compare/v0.0.1-beta.1...v0.0.1) (2023-12-13)

### Features

- add current set of dev contracts ([2b5e7a3](https://github.com/InverterNetwork/abis/commit/2b5e7a35cb4bb6c26bcc57b181a45aff7cf23dd3))

### [0.0.1-beta.1](https://github.com/InverterNetwork/abis/compare/v0.0.1-beta.0...v0.0.1-beta.1) (2023-12-13)

### Bug Fixes

- seperate build and bundle ([2fbca8e](https://github.com/InverterNetwork/abis/commit/2fbca8e55e25eb454006bde58743f258b5e209dc))

### 0.0.1-beta.0 (2023-12-13)

### Features

- abi bundler ([8857d87](https://github.com/InverterNetwork/abis/commit/8857d87035f289e5bc80ee467bf058a2c8bf495a))
