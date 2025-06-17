"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, TrendingUp, Globe, Coins, Search } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

interface Currency {
  countryCode: string
  countryName: string
  currencyCode: string
  currencyName: string
  currencySymbol: string
  flagEmoji: string
  credParityRate: number
  credPairCode: string
}

interface ConversionResult {
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  rate: number
  timestamp: string
}

export function CurrencyConverter() {
  const { t } = useI18n()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [amount, setAmount] = useState<string>("100")
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("CRED")
  const [conversion, setConversion] = useState<ConversionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const fetchCurrencies = async () => {
    try {
      const response = await fetch("/api/currencies")
      const data = await response.json()

      if (data.success) {
        // Add CRED as a special currency
        const credCurrency: Currency = {
          countryCode: "CRED",
          countryName: "Global",
          currencyCode: "CRED",
          currencyName: "CRED Token",
          currencySymbol: "₢",
          flagEmoji: "₢",
          credParityRate: 1.0,
          credPairCode: "CRED-CRED",
        }

        setCurrencies([credCurrency, ...data.currencies])
      }
    } catch (error) {
      console.error("Error fetching currencies:", error)
      setError("Failed to load currencies")
    }
  }

  const handleConvert = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/currencies/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          fromCurrency,
          toCurrency,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setConversion(data.conversion)
      } else {
        setError(data.error || "Conversion failed")
      }
    } catch (error) {
      console.error("Conversion error:", error)
      setError("Failed to convert currency")
    } finally {
      setLoading(false)
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setConversion(null)
  }

  const getPopularCurrencies = () => {
    return currencies.filter((c) =>
      ["USD", "EUR", "GBP", "JPY", "CNY", "INR", "CRED", "CAD", "AUD", "BRL"].includes(c.currencyCode),
    )
  }

  const groupCurrenciesByRegion = () => {
    const regions: Record<string, Currency[]> = {}

    currencies.forEach((currency) => {
      const region = getRegionForCountry(currency.countryCode)
      if (!regions[region]) {
        regions[region] = []
      }
      regions[region].push(currency)
    })

    return regions
  }

  const getRegionForCountry = (countryCode: string): string => {
    if (countryCode === "CRED") return "🌍 Global"
    if (["USA", "CAN", "MEX"].includes(countryCode)) return "🌎 North America"
    if (["GBR", "DEU", "FRA", "ITA", "ESP"].includes(countryCode)) return "🇪🇺 Europe"
    if (["CHN", "JPN", "IND", "KOR", "SGP"].includes(countryCode)) return "🌏 Asia"
    if (["BRA", "ARG", "CHL", "COL", "PER"].includes(countryCode)) return "🌎 South America"
    if (["NGA", "ZAF", "EGY", "KEN", "GHA"].includes(countryCode)) return "🌍 Africa"
    if (["AUS", "NZL", "FJI", "PNG"].includes(countryCode)) return "🌏 Oceania"
    return "🌐 Other"
  }

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.currencyName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getSelectedCurrency = (code: string) => {
    return currencies.find((c) => c.currencyCode === code)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Global CRED Currency Converter
          </CardTitle>
          <CardDescription>
            Convert between CRED and any of the 195+ supported world currencies with real-time parity rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Popular Currencies */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Popular Currencies</Label>
            <div className="flex flex-wrap gap-2">
              {getPopularCurrencies().map((currency) => (
                <Badge
                  key={currency.currencyCode}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-sm px-3 py-1"
                  onClick={() => setFromCurrency(currency.currencyCode)}
                >
                  <span className="mr-1">{currency.flagEmoji}</span>
                  {currency.currencySymbol} {currency.currencyCode}
                </Badge>
              ))}
            </div>
          </div>

          {/* Conversion Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className="text-lg"
              />
            </div>

            <div>
              <Label htmlFor="fromCurrency">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue>
                    {getSelectedCurrency(fromCurrency) && (
                      <div className="flex items-center gap-2">
                        <span>{getSelectedCurrency(fromCurrency)?.flagEmoji}</span>
                        <span>{fromCurrency}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search currencies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  {Object.entries(groupCurrenciesByRegion()).map(([region, regionCurrencies]) => {
                    const filtered = regionCurrencies.filter(
                      (currency) =>
                        currency.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        currency.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        currency.currencyName.toLowerCase().includes(searchTerm.toLowerCase()),
                    )

                    if (filtered.length === 0) return null

                    return (
                      <div key={region}>
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground sticky top-0 bg-background">
                          {region}
                        </div>
                        {filtered.map((currency) => (
                          <SelectItem key={currency.currencyCode} value={currency.currencyCode}>
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-lg">{currency.flagEmoji}</span>
                              <span className="font-medium">{currency.currencyCode}</span>
                              <span className="text-xs text-muted-foreground truncate">{currency.countryName}</span>
                              <span className="ml-auto text-xs text-muted-foreground">{currency.currencySymbol}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={swapCurrencies} className="rounded-full">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label htmlFor="toCurrency">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue>
                    {getSelectedCurrency(toCurrency) && (
                      <div className="flex items-center gap-2">
                        <span>{getSelectedCurrency(toCurrency)?.flagEmoji}</span>
                        <span>{toCurrency}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search currencies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  {Object.entries(groupCurrenciesByRegion()).map(([region, regionCurrencies]) => {
                    const filtered = regionCurrencies.filter(
                      (currency) =>
                        currency.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        currency.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        currency.currencyName.toLowerCase().includes(searchTerm.toLowerCase()),
                    )

                    if (filtered.length === 0) return null

                    return (
                      <div key={region}>
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground sticky top-0 bg-background">
                          {region}
                        </div>
                        {filtered.map((currency) => (
                          <SelectItem key={currency.currencyCode} value={currency.currencyCode}>
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-lg">{currency.flagEmoji}</span>
                              <span className="font-medium">{currency.currencyCode}</span>
                              <span className="text-xs text-muted-foreground truncate">{currency.countryName}</span>
                              <span className="ml-auto text-xs text-muted-foreground">{currency.currencySymbol}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleConvert} disabled={loading} className="w-full" size="lg">
            {loading ? "Converting..." : "Convert Currency"}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {conversion && (
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold flex items-center justify-center gap-2">
                    <span className="flex items-center gap-1">
                      {getSelectedCurrency(conversion.fromCurrency)?.flagEmoji}
                      {conversion.fromAmount.toLocaleString()} {conversion.fromCurrency}
                    </span>
                    <ArrowUpDown className="h-6 w-6 text-muted-foreground" />
                    <span className="flex items-center gap-1">
                      {getSelectedCurrency(conversion.toCurrency)?.flagEmoji}
                      {conversion.toAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      })}{" "}
                      {conversion.toCurrency}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Exchange Rate: 1 {conversion.fromCurrency} = {conversion.rate.toFixed(8)} {conversion.toCurrency}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(conversion.timestamp).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Currency Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Global Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencies.length}</div>
            <p className="text-xs text-muted-foreground">Supported currencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              CRED Base Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.00</div>
            <p className="text-xs text-muted-foreground">USD parity maintained</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Real-time Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Live</div>
            <p className="text-xs text-muted-foreground">Parity rates updated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">🏳️ Flag Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">195+</div>
            <p className="text-xs text-muted-foreground">Country flags included</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CurrencyConverter
