import type { Address, Hash, PublicClient, WalletClient } from 'viem'
import type { mainnet, base } from 'viem/chains'

// Chain types
export type SupportedChain = 'ethereum' | 'base'

export interface ChainConfig {
  chain: typeof mainnet | typeof base
  publicClient: PublicClient
  walletClient?: WalletClient
}

// Configuration types
export interface EvmPluginConfig {
  rpcUrl?: {
    ethereum?: string
    base?: string
  }
  testMode?: boolean
}

// Transaction types
export interface Transaction {
  hash: Hash
  from: Address
  to: Address
  value: bigint
  data?: `0x${string}`
}

export interface TransferParams {
  fromChain: SupportedChain
  toAddress: Address
  amount: string
  data?: string
}

export interface SwapParams {
  chain: SupportedChain
  fromToken: Address
  toToken: Address
  amount: string
  slippage?: number
}

export interface BridgeParams {
  fromChain: SupportedChain
  toChain: SupportedChain
  fromToken: Address
  toToken: Address
  toAddress: Address
  amount: string
}

// Balance types
export interface TokenData {
  symbol: string
  decimals: number
  address: Address
}

export interface TokenBalance extends TokenData {
  balance: bigint
  price?: string
  value?: string
}

export interface WalletBalance {
  chain: SupportedChain
  address: Address
  totalValueUSD: string
  tokens: TokenBalance[]
}

// LiFi types
export type LiFiStatus = {
  status: 'PENDING' | 'DONE' | 'FAILED'
  substatus?: string
  error?: Error
}

export type LiFiRoute = {
  transactionHash: Hash
  transactionData: `0x${string}`
  toAddress: Address
}

export type LiFiExecutionResult = {
  transactionHash: Hash
  transactionData: `0x${string}`
  toAddress: Address
  status: LiFiStatus
}

export type SwapContext = {
  fromToken: Address
  toToken: Address
  amount: string
  chain: SupportedChain
}