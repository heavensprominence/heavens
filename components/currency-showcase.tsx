"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Currency {
  code: string
  name: string
  rate: number
  change: number
  flag: string
}

export function CurrencyShowcase() {
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: "USD", name: "US Dollar", rate: 1.0, change: 0.12, flag: "🇺🇸" },
    { code: "EUR", name: "Euro", rate: 0.85, change: -0.08, flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", rate: 0.73, change: 0.15, flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", rate: 110.25, change: -0.32, flag: "🇯🇵" },
    { code: "CAD", name: "Canadian Dollar", rate: 1.25, change: 0.07, flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", rate: 1.35, change: 0.18, flag: "🇦🇺" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrencies((prev) =>
        prev.map((currency) => ({
          ...currency,
          rate: currency.rate + (Math.random() - 0.5) * 0.02,
          change: (Math.random() - 0.5) * 0.5,
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Live Currency Rates (CRED Parity)</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {currencies.map((currency) => (
            <Card key={currency.code} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{currency.flag}</div>
                <div className="font-bold text-white">{currency.code}</div>
                <div className="text-sm text-gray-400 mb-2">{currency.name}</div>
                <div className="text-lg font-semibold text-yellow-500">₡{currency.rate.toFixed(4)}</div>
                <div
                  className={`flex items-center justify-center text-sm ${
                    currency.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {currency.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(currency.change).toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
