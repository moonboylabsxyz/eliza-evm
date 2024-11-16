import { Address, formatUnits } from 'viem'
import type { TokenProvider } from './token'
import type { WalletBalance, TokenBalance, SupportedChain } from '../types'
import { parseUnits } from 'viem'

const PROVIDER_CONFIG = {
  PRICE_API: 'https://li.quest/v1',
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  NATIVE_TOKEN: {
    ethereum: '0x0000000000000000000000000000000000000000',
    base: '0x0000000000000000000000000000000000000000'
  }
}

export class BalancesProvider {
  private priceCache: Map<string, { price: string; timestamp: number }> = new Map()

  constructor(
    private tokenProvider: TokenProvider,
    private walletAddress: Address
  ) {}

  private async getTokenPrice(chain: SupportedChain, tokenAddress: Address): Promise<string> {
    const cacheKey = `${chain}-${tokenAddress}`
    const cached = this.priceCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < PROVIDER_CONFIG.CACHE_TTL) {
      return cached.price
    }

    try {
      const response = await fetch(
        `${PROVIDER_CONFIG.PRICE_API}/token?chain=${chain}&token=${tokenAddress}`
      )
      const data = await response.json()
      const price = data.priceUSD || '0'
      
      this.priceCache.set(cacheKey, {
        price,
        timestamp: Date.now()
      })
      
      return price
    } catch (error) {
      console.error(`Failed to fetch price for ${tokenAddress} on ${chain}:`, error)
      return '0'
    }
  }

  async getWalletBalances(chains: SupportedChain[]): Promise<WalletBalance[]> {
    return Promise.all(
      chains.map(async (chain): Promise<WalletBalance> => {
        const tokens = await this.tokenProvider.getTokens(chain)
        const balances = await Promise.all(
          tokens.map(async (token): Promise<TokenBalance> => {
            const [balance, price] = await Promise.all([
              this.tokenProvider.getTokenBalance(chain, token.address, this.walletAddress),
              this.getTokenPrice(chain, token.address)
            ])

            const formattedBalance = formatUnits(balance, token.decimals)
            const value = (Number(formattedBalance) * Number(price)).toString()

            return {
              ...token,
              balance,
              price,
              value
            }
          })
        )

        const nonZeroBalances = balances.filter(t => t.balance > 0n)
        const totalValueUSD = nonZeroBalances
          .reduce((sum, t) => sum + Number(t.value || 0), 0)
          .toString()

        return {
          chain,
          address: this.walletAddress,
          totalValueUSD,
          tokens: nonZeroBalances
        }
      })
    )
  }
}