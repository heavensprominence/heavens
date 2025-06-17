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
      for (const row of result) {
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

  async updateParityRate(currencyCode: string, newRate: number): Promise<boolean> {
    try {
      await db.query(`SELECT update_currency_parity_rate($1, $2)`, [currencyCode, newRate])

      // Update local cache
      const currency = this.currencies.get(currencyCode)
      if (currency) {
        currency.credParityRate = newRate
      }

      return true
    } catch (error) {
      console.error(`❌ Error updating parity rate for ${currencyCode}:`, error)
      return false
    }
  }

  private isStale(): boolean {
    const staleTime = 5 * 60 * 1000 // 5 minutes
    return Date.now() - this.lastUpdate.getTime() > staleTime
  }

  formatAmount(amount: number, currencyCode: string): string {
    const currency = this.currencies.get(currencyCode)
    if (!currency) return `${amount} ${currencyCode}`

    return `${currency.flagEmoji} ${currency.currencySymbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })}`
  }

  getCurrenciesByRegion(): Record<string, Currency[]> {
    const regions: Record<string, Currency[]> = {}

    for (const currency of this.currencies.values()) {
      const region = this.getRegionForCountry(currency.countryCode)
      if (!regions[region]) {
        regions[region] = []
      }
      regions[region].push(currency)
    }

    return regions
  }

  private getRegionForCountry(countryCode: string): string {
    if (countryCode === "CRED") return "🌍 Global"

    // North America
    if (
      [
        "USA",
        "CAN",
        "MEX",
        "GTM",
        "BLZ",
        "CRI",
        "SLV",
        "HND",
        "NIC",
        "PAN",
        "CUB",
        "HTI",
        "DOM",
        "JAM",
        "BHS",
        "BRB",
        "TTO",
        "ATG",
        "DMA",
        "GRD",
        "KNA",
        "LCA",
        "VCT",
      ].includes(countryCode)
    ) {
      return "🌎 North America"
    }

    // South America
    if (["BRA", "ARG", "CHL", "COL", "PER", "VEN", "ECU", "BOL", "PRY", "URY", "GUY", "SUR"].includes(countryCode)) {
      return "🌎 South America"
    }

    // Europe
    if (
      [
        "GBR",
        "DEU",
        "FRA",
        "ITA",
        "ESP",
        "EUR",
        "POL",
        "ROU",
        "NLD",
        "GRC",
        "PRT",
        "CZE",
        "HUN",
        "SWE",
        "AUT",
        "BEL",
        "CHE",
        "DNK",
        "FIN",
        "IRL",
        "NOR",
        "SVK",
        "BGR",
        "HRV",
        "EST",
        "LVA",
        "LTU",
        "SVN",
        "LUX",
        "MLT",
        "CYP",
        "ISL",
        "LIE",
        "MCO",
        "SMR",
        "VAT",
        "AND",
        "ALB",
        "BIH",
        "MKD",
        "MNE",
        "SRB",
        "XKX",
        "MDA",
        "BLR",
        "UKR",
        "RUS",
      ].includes(countryCode)
    ) {
      return "🇪🇺 Europe"
    }

    // Asia
    if (
      [
        "CHN",
        "JPN",
        "IND",
        "KOR",
        "IDN",
        "THA",
        "VNM",
        "PHL",
        "MYS",
        "SGP",
        "BGD",
        "PAK",
        "LKA",
        "MMR",
        "KHM",
        "LAO",
        "NPL",
        "BTN",
        "AFG",
        "IRN",
        "IRQ",
        "TUR",
        "ISR",
        "JOR",
        "LBN",
        "SYR",
        "SAU",
        "ARE",
        "QAT",
        "KWT",
        "BHR",
        "OMN",
        "YEM",
        "KAZ",
        "UZB",
        "TKM",
        "TJK",
        "KGZ",
        "MNG",
        "GEO",
        "ARM",
        "AZE",
        "BRN",
        "MDV",
        "TLS",
        "TWN",
        "PRK",
      ].includes(countryCode)
    ) {
      return "🌏 Asia"
    }

    // Africa
    if (
      [
        "NGA",
        "ZAF",
        "EGY",
        "KEN",
        "GHA",
        "ETH",
        "TZA",
        "UGA",
        "MOZ",
        "MDG",
        "CMR",
        "CIV",
        "NER",
        "BFA",
        "MLI",
        "SEN",
        "TCD",
        "SOM",
        "ZMB",
        "ZWE",
        "BWA",
        "NAM",
        "LSO",
        "SWZ",
        "GAB",
        "GNQ",
        "CAF",
        "COG",
        "COD",
        "AGO",
        "DZA",
        "MAR",
        "TUN",
        "LBY",
        "SDN",
        "SSD",
        "ERI",
        "DJI",
        "GMB",
        "GIN",
        "GNB",
        "LBR",
        "SLE",
        "TGO",
        "BEN",
        "MRT",
        "CPV",
        "STP",
        "COM",
        "SYC",
        "MUS",
        "RWA",
        "BDI",
        "MWI",
      ].includes(countryCode)
    ) {
      return "🌍 Africa"
    }

    // Oceania
    if (
      [
        "AUS",
        "NZL",
        "FJI",
        "PNG",
        "SLB",
        "VUT",
        "NCL",
        "PYF",
        "WSM",
        "TON",
        "KIR",
        "TUV",
        "NRU",
        "PLW",
        "MHL",
        "FSM",
      ].includes(countryCode)
    ) {
      return "🌏 Oceania"
    }

    return "🌐 Other"
  }
}

// Export singleton instance
export const credParity = CREDParitySystem.getInstance()
