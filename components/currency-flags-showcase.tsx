"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Globe } from "lucide-react"

interface Currency {
  countryCode: string
  countryName: string
  currencyCode: string
  currencyName: string
  currencySymbol: string
  flagEmoji: string
  credParityRate: number
}

export function CurrencyFlagsShowcase() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const fetchCurrencies = async () => {
    try {
      const response = await fetch("/api/currencies")
      const data = await response.json()

      if (data.success) {
        setCurrencies(data.currencies)
      }
    } catch (error) {
      console.error("Error fetching currencies:", error)
    }
  }

  const getRegionForCountry = (countryCode: string): string => {
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
      return "North America"
    }
    if (["BRA", "ARG", "CHL", "COL", "PER", "VEN", "ECU", "BOL", "PRY", "URY", "GUY", "SUR"].includes(countryCode)) {
      return "South America"
    }
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
      return "Europe"
    }
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
      return "Asia"
    }
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
      return "Africa"
    }
    if (
      ["AUS", "NZL", "FJI", "PNG", "SLB", "VUT", "WSM", "TON", "KIR", "TUV", "NRU", "PLW", "MHL", "FSM"].includes(
        countryCode,
      )
    ) {
      return "Oceania"
    }
    return "Other"
  }

  const filteredCurrencies = currencies.filter((currency) => {
    const matchesSearch =
      currency.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.currencyName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRegion = selectedRegion === "All" || getRegionForCountry(currency.countryCode) === selectedRegion

    return matchesSearch && matchesRegion
  })

  const regions = ["All", "Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Other"]

  const groupedCurrencies = filteredCurrencies.reduce(
    (acc, currency) => {
      const region = getRegionForCountry(currency.countryCode)
      if (!acc[region]) acc[region] = []
      acc[region].push(currency)
      return acc
    },
    {} as Record<string, Currency[]>,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Global Currency Flags Showcase
          </CardTitle>
          <CardDescription>
            Explore all 195+ country flags and their currencies supported by the CRED parity system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search countries or currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <Badge
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </Badge>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredCurrencies.length} of {currencies.length} currencies
          </div>
        </CardContent>
      </Card>

      {/* Currency Grid by Region */}
      {Object.entries(groupedCurrencies).map(([region, regionCurrencies]) => (
        <Card key={region}>
          <CardHeader>
            <CardTitle className="text-lg">
              {region === "Africa" && "🌍"}
              {region === "Asia" && "🌏"}
              {region === "Europe" && "🇪🇺"}
              {region === "North America" && "🌎"}
              {region === "South America" && "🌎"}
              {region === "Oceania" && "🌏"}
              {region === "Other" && "🌐"} {region} ({regionCurrencies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {regionCurrencies.map((currency) => (
                <div
                  key={currency.countryCode}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="text-2xl">{currency.flagEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{currency.countryName}</div>
                    <div className="text-xs text-muted-foreground">
                      {currency.currencySymbol} {currency.currencyCode}
                    </div>
                    <div className="text-xs text-muted-foreground">{currency.credParityRate.toFixed(4)} CRED</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredCurrencies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">No currencies found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or selected region</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CurrencyFlagsShowcase
