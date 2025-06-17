import { db } from "@/lib/db"

export interface Currency {
  countryCode: string
  countryName: string
  currencyCode: string
  currencyName: string
  currencySymbol: string
  flagEmoji: string
  credParityRate: number
  credPairCode: string
}

export interface ConversionResult {
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  rate: number
  timestamp: Date
}

export class CREDParitySystem {
  private static instance: CREDParitySystem
  private currencies: Map<string, Currency> = new Map()
  private lastUpdate: Date = new Date(0)

  static getInstance(): CREDParitySystem {
    if (!CREDParitySystem.instance) {
      CREDParitySystem.instance = new CREDParitySystem()
    }
    return CREDParitySystem.instance
  }

  async loadCurrencies(): Promise<void> {
    try {
      const result = await db.query(`
        SELECT 
          country_code,
          country_name,
          currency_code,
          currency_name,
          currency_symbol,
          flag_emoji,
          cred_parity_rate,
          CONCAT(currency_code, '-CRED') as cred_pair_code
        FROM global_currencies 
        WHERE is_active = true
        ORDER BY country_name
      `)

      this.currencies.clear()
      for (const row of result.rows) {
        const currency: Currency = {
          countryCode: row.country_code,
          countryName: row.country_name,
          currencyCode: row.currency_code,
          currencyName: row.currency_name,
          currencySymbol: row.currency_symbol,
          flagEmoji: row.flag_emoji || "🏳️",
          credParityRate: Number.parseFloat(row.cred_parity_rate),
          credPairCode: row.cred_pair_code,
        }
        this.currencies.set(row.currency_code, currency)
      }

      this.lastUpdate = new Date()
      console.log(`✅ Loaded ${this.currencies.size} currencies with flags for CRED parity`)
    } catch (error) {
      console.error("❌ Error loading currencies:", error)
      throw error
    }
  }

  async getAllCurrencies(): Promise<Currency[]> {
    if (this.currencies.size === 0 || this.isStale()) {
      await this.loadCurrencies()
    }
    return Array.from(this.currencies.values())
  }

  async getCurrency(currencyCode: string): Promise<Currency | null> {
    if (this.currencies.size === 0 || this.isStale()) {
      await this.loadCurrencies()
    }
    return this.currencies.get(currencyCode) || null
  }

  async convertToCRED(amount: number, fromCurrency: string): Promise<ConversionResult> {
    const currency = await this.getCurrency(fromCurrency)
    if (!currency) {
      throw new Error(`Currency ${fromCurrency} not supported`)
    }

    const credAmount = amount / currency.credParityRate

    return {
      fromAmount: amount,
      toAmount: credAmount,
      fromCurrency: fromCurrency,
      toCurrency: "CRED",
      rate: currency.credParityRate,
      timestamp: new Date(),
    }
  }

  async convertFromCRED(credAmount: number, toCurrency: string): Promise<ConversionResult> {
    const currency = await this.getCurrency(toCurrency)
    if (!currency) {
      throw new Error(`Currency ${toCurrency} not supported`)
    }

    const localAmount = credAmount * currency.credParityRate

    return {
      fromAmount: credAmount,
      toAmount: localAmount,
      fromCurrency: "CRED",
      toCurrency: toCurrency,
      rate: currency.credParityRate,
      timestamp: new Date(),
    }
  }

  async convertBetweenCurrencies(amount: number, fromCurrency: string, toCurrency: string): Promise<ConversionResult> {
    if (fromCurrency === toCurrency) {
      return {
        fromAmount: amount,
        toAmount: amount,
        fromCurrency,
        toCurrency,
        rate: 1,
        timestamp: new Date(),
      }
    }

    // Convert through CRED as the base currency
    const toCred = await this.convertToCRED(amount, fromCurrency)
    const fromCred = await this.convertFromCRED(toCred.toAmount, toCurrency)

    return {
      fromAmount: amount,
      toAmount: fromCred.toAmount,
      fromCurrency,
      toCurrency,
      rate: fromCred.toAmount / amount,
      timestamp: new Date(),
    }
  }

  private isStale(): boolean {
    const staleTime = 5 * 60 * 1000 // 5 minutes
    return Date.now() - this.lastUpdate.getTime() > staleTime
  }
}

// Export singleton instance
export const credParity = CREDParitySystem.getInstance()
