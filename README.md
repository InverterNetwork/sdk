<div align="center">

[![license](https://img.shields.io/badge/License-LGPL%20v3-blue)](/LICENSE.md)
[![npm latest package](https://img.shields.io/npm/v/@inverter-network/sdk/latest.svg)](https://www.npmjs.com/package/@inverter-network/sdk)
[![npm downloads](https://img.shields.io/npm/dm/@inverter-network/sdk.svg)](https://www.npmjs.com/package/@inverter-network/sdk)
[![Follow on Twitter](https://img.shields.io/twitter/follow/inverternetwork.svg?label=follow+INVERTER)](https://twitter.com/inverternetwork)

</div>

## Inverter / TS SDK

Bun + Npm + Type Safe Formatted Functions

## Summary

This package contains abstracted functions for the inverter contract functions compiled for typescript [INVERTER](https://github.com/InverterNetwork).
Learn more about INVERTER on (https://inverter.network).

Check out the [Changelog](./CHANGELOG.md) to see what changed in the last releases.

## Install dependencies

Install Bun ( bun is used for testing for primitives no bun is needed ):

```bash
# Supported on macOS, Linux, and WSL

curl -fsSL https://bun.sh/install | bash

# Upgrade Bun every once in a while

bun upgrage

```

Install dependencies:

```bash
bun add @inverter-network/sdk
```

or

```bash
npm install @inverter-network/sdk
```

## How to make a release

**For the Maintainer**: Add NPM_TOKEN to the GitHub Secrets.

1. PR with changes
2. Merge PR into main
3. Checkout main
4. `git pull`
5. `bun release: '' | alpha | beta` optionally add `-- --release-as minor | major`
6. Make sure everything looks good (e.g. in CHANGELOG.md)
7. Lastly follow the instructions given by release log
8. Done

## Summary

This package contains abstracted functions for the inverter contract functions compiled for typescript [INVERTER projects](https://github.com/InverterNetwork).
