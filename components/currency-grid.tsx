"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { WORLD_CURRENCIES, getExchangeRates } from "@/lib/currencies"
import { Search } from "lucide-react"

export function CurrencyGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})

  useEffect(() => {
    getExchangeRates().then(setExchangeRates)
  }, [])

  const filteredCurrencies = WORLD_CURRENCIES.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <section className="mb-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🌍 All CRED Currency Variants</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCurrencies.map((currency) => (
              <Card key={currency.code} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{currency.emoji}</span>
                    <Badge variant="secondary">{currency.code}-CRED</Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{currency.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{currency.code}-CRED</p>
                  {exchangeRates[currency.code] && (
                    <p className="text-xs font-medium">
                      1 {currency.code} = {exchangeRates[currency.code]?.toFixed(4)} USD
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
