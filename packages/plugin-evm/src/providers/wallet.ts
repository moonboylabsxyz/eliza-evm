import { createPublicClient, createWalletClient, http, custom, type PublicClient, type WalletClient } from 'viem'
import { mainnet, base } from 'viem/chains'
import type { SupportedChain, ChainConfig } from '../types'

export const CHAIN_CONFIGS = {
  ethereum: {
    chainId: 1,
    chain: mainnet,
    rpcUrl: 'https://eth.llamarpc.com'
  },
  base: {
    chainId: 8453,
    chain: base,
    rpcUrl: 'https://base.llamarpc.com'
  }
} as const

export class WalletProvider {
  private chainConfigs: Record<SupportedChain, ChainConfig>
  private currentChain: SupportedChain = 'ethereum'

  constructor(rpcUrls?: { ethereum?: string; base?: string }) {
    this.chainConfigs = {
      ethereum: {
        chain: mainnet,
        publicClient: createPublicClient({
          chain: mainnet,
          transport: http(rpcUrls?.ethereum || CHAIN_CONFIGS.ethereum.rpcUrl),
          batch: {
            multicall: true
          }
        })
      },
      base: {
        chain: base,
        publicClient: createPublicClient({
          chain: base,
          transport: http(rpcUrls?.base || CHAIN_CONFIGS.base.rpcUrl),
          batch: {
            multicall: true
          }
        })
      }
    }
  }

  async connect(): Promise<`0x${string}`> {
    if (typeof window === 'undefined') {
      throw new Error('Window object not found. Are you running in a browser environment?')
    }

    const ethereum = (window as any).ethereum
    if (!ethereum) {
      throw new Error('No Ethereum provider found')
    }

    const walletClient = createWalletClient({
      chain: this.chainConfigs[this.currentChain].chain,
      transport: custom(ethereum)
    })

    const [address] = await walletClient.getAddresses()
    this.chainConfigs[this.currentChain].walletClient = walletClient

    return address
  }

  getPublicClient(chain: SupportedChain): PublicClient {
    return this.chainConfigs[chain].publicClient
  }

  getWalletClient(): WalletClient {
    const walletClient = this.chainConfigs[this.currentChain].walletClient
    if (!walletClient) throw new Error('Wallet not connected')
    return walletClient
  }

  async switchChain(chain: SupportedChain): Promise<void> {
    const walletClient = this.chainConfigs[this.currentChain].walletClient
    if (!walletClient) throw new Error('Wallet not connected')
    
    await walletClient.switchChain({ id: this.chainConfigs[chain].chain.id })
    this.currentChain = chain
  }

  getCurrentChain(): SupportedChain {
    return this.currentChain
  }
}