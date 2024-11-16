import type { Plugin } from '@ai16z/eliza'
import { WalletProvider } from './providers/wallet'
import { TokenProvider } from './providers/token'
import { BalancesProvider } from './providers/balances'
import { TransferAction } from './actions/transfer'
import { BridgeAction } from './actions/bridge'
import { SwapAction } from './actions/swap'
import type { EvmPluginConfig, SupportedChain, Transaction } from './types'

export class EvmPlugin implements Plugin {
  public name = 'evm'
  public description = 'EVM blockchain integration plugin for Ethereum and Base'
  
  private walletProvider: WalletProvider
  private tokenProvider: TokenProvider
  private balancesProvider: BalancesProvider
  private transferAction: TransferAction
  private bridgeAction: BridgeAction
  private swapAction: SwapAction

  constructor(config?: EvmPluginConfig) {
    this.walletProvider = new WalletProvider(config?.rpcUrl)
    this.tokenProvider = new TokenProvider(this.walletProvider)
    this.transferAction = new TransferAction(this.walletProvider)
    this.bridgeAction = new BridgeAction(this.walletProvider)
    this.swapAction = new SwapAction(this.walletProvider)
  }

  async connect(): Promise<`0x${string}`> {
    const address = await this.walletProvider.connect()
    this.balancesProvider = new BalancesProvider(this.tokenProvider, address)
    return address
  }

  async getBalances(chains: SupportedChain[] = ['ethereum', 'base']) {
    return this.balancesProvider.getWalletBalances(chains)
  }

  async transfer(params: {
    fromChain: SupportedChain
    toAddress: `0x${string}`
    amount: string
    data?: string
  }): Promise<Transaction> {
    return this.transferAction.transfer(params)
  }

  async bridge(params: {
    fromChain: SupportedChain
    toChain: SupportedChain
    fromToken: `0x${string}`
    toToken: `0x${string}`
    toAddress: `0x${string}`
    amount: string
  }): Promise<Transaction> {
    return this.bridgeAction.bridge(params)
  }

  async swap(params: {
    chain: SupportedChain
    fromToken: `0x${string}`
    toToken: `0x${string}`
    amount: string
    slippage?: number
  }): Promise<Transaction> {
    return this.swapAction.swap(params)
  }
}

export default EvmPlugin