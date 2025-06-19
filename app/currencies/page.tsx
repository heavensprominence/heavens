"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Globe, Coins } from "lucide-react"
import { CurrencyConverter } from "@/components/currency-converter"

interface Currency {
  id: number
  code: string
  name: string
  country: string
  flag: string
  cred_parity: number
  region: string
  is_active: boolean
}

export default function CurrenciesPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const fetchCurrencies = async () => {
    try {
      const response = await fetch("/api/currencies")
      const data = await response.json()
      setCurrencies(data.currencies || [])
    } catch (error) {
      console.error("Error fetching currencies:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCurrencies = currencies.filter((currency) => {
    const matchesSearch =
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.country.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRegion = selectedRegion === "all" || currency.region === selectedRegion

    return matchesSearch && matchesRegion && currency.is_active
  })

  const regions = [...new Set(currencies.map((c) => c.region))].sort()

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading currencies...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Global Currency System</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Universal CRED parity for all 195+ countries. Trade with anyone, anywhere.
          </p>
        </div>

        {/* Currency Converter */}
        <div className="mb-8">
          <CurrencyConverter />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search currencies, countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedRegion === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion("all")}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              All Regions
            </Button>
            {regions.slice(0, 5).map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region)}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                {region}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{currencies.length}</div>
              <div className="text-gray-400 text-sm">Total Currencies</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{regions.length}</div>
              <div className="text-gray-400 text-sm">Regions</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <Coins className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1.00</div>
              <div className="text-gray-400 text-sm">CRED Base Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-gray-400 text-sm">Live Trading</div>
            </CardContent>
          </Card>
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCurrencies.map((currency) => (
            <Card key={currency.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{currency.flag}</span>
                    <div>
                      <CardTitle className="text-lg text-white">{currency.code}</CardTitle>
                      <p className="text-sm text-gray-400">{currency.country}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {currency.region}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">CRED Parity</span>
                    <span className="text-white font-mono">{currency.cred_parity.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">1 CRED =</span>
                    <span className="text-green-400 font-mono">
                      {(1 / currency.cred_parity).toFixed(2)} {currency.code}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCurrencies.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No currencies found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
