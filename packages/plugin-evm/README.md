# EVM Plugin

This plugin is used to interact with EVM chains, focusing only on Ethereum mainnet and Base for now.

## TODO

- Make the EVM_RPC_URL set as defaults within the plugin-evm package and optinally overwritten by .env file.
- We shouldnt need to specify/handle logic for contract addresses or chain id, as this should be handled by the agent, Viem, and lifi sdk.
- Add a `swapTemplate`, `transferTemplate`, and `approveTemplate` to the plugin-evm package.
