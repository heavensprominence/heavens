"use client"

import { CurrencyConverter } from "@/components/currency-converter"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Coins, TrendingUp, Shield, Zap, Users } from "lucide-react"

export default function CurrenciesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-10 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">🌍 Global CRED Parity System</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Universal currency conversion with CRED as the global standard. Supporting all 195+ countries with real-time
            parity rates, beautiful flag emojis, and transparent exchange.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-sm">
              🏳️ 195+ Country Flags
            </Badge>
            <Badge variant="outline" className="text-sm">
              ⚡ Real-time Rates
            </Badge>
            <Badge variant="outline" className="text-sm">
              💰 Zero Hidden Fees
            </Badge>
            <Badge variant="outline" className="text-sm">
              🚀 Instant Conversion
            </Badge>
          </div>
        </div>

        {/* Currency Converter */}
        <CurrencyConverter />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />🌐 Universal Coverage
              </CardTitle>
              <CardDescription>Every country, every currency, one global standard</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>🏳️ All 195+ UN recognized countries</li>
                <li>💱 Major and minor currencies supported</li>
                <li>🤝 Regional currency unions included</li>
                <li>📈 Emerging market currencies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />💎 CRED Parity Standard
              </CardTitle>
              <CardDescription>Transparent, fair, and consistent exchange rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>🇺🇸 USD-CRED 1:1 base parity</li>
                <li>⏱️ Real-time rate adjustments</li>
                <li>🚫 No hidden conversion fees</li>
                <li>🤖 Algorithmic rate determination</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />📊 Market Integration
              </CardTitle>
              <CardDescription>Seamless integration with global markets</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>📡 Live market data integration</li>
                <li>🌉 Cross-border trade support</li>
                <li>💸 Remittance optimization</li>
                <li>🏢 Business payment solutions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                🛡️ Regulatory Compliance
              </CardTitle>
              <CardDescription>Full compliance with international standards</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>🔍 AML/KYC compliance</li>
                <li>⚖️ FATF recommendations</li>
                <li>📋 Local regulatory adherence</li>
                <li>🚨 Sanctions screening</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />⚡ Instant Processing
              </CardTitle>
              <CardDescription>Lightning-fast currency conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>🏃‍♂️ Sub-second conversion times</li>
                <li>🔄 Real-time balance updates</li>
                <li>✅ Instant settlement</li>
                <li>🌙 24/7 availability</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />🌍 Global Accessibility
              </CardTitle>
              <CardDescription>Designed for worldwide adoption</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>🗣️ Multi-language support</li>
                <li>💳 Local payment methods</li>
                <li>📱 Mobile-first design</li>
                <li>📶 Offline capability</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Supported Regions with Flag Emojis */}
        <Card>
          <CardHeader>
            <CardTitle>🗺️ Supported Regions & Currencies</CardTitle>
            <CardDescription>
              Complete coverage of all major economic regions and currency zones with beautiful flag representations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  🌍 Africa
                  <Badge variant="secondary" className="text-xs">
                    54 countries
                  </Badge>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    🇸🇳🇲🇱🇧🇫 <span>West African CFA Franc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇨🇲🇹🇩🇨🇫 <span>Central African CFA Franc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇿🇦 <span>South African Rand</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇳🇬 <span>Nigerian Naira</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇪🇬 <span>Egyptian Pound</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  🌏 Asia
                  <Badge variant="secondary" className="text-xs">
                    48 countries
                  </Badge>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    🇨🇳 <span>Chinese Yuan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇯🇵 <span>Japanese Yen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇮🇳 <span>Indian Rupee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇰🇷 <span>Korean Won</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇹🇭 <span>Thai Baht</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  🌍 Europe
                  <Badge variant="secondary" className="text-xs">
                    44 countries
                  </Badge>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    🇪🇺 <span>Euro (19 countries)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇬🇧 <span>British Pound</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇨🇭 <span>Swiss Franc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇷🇺 <span>Russian Ruble</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇵🇱 <span>Polish Zloty</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  🌎 Americas
                  <Badge variant="secondary" className="text-xs">
                    35 countries
                  </Badge>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    🇺🇸 <span>US Dollar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇨🇦 <span>Canadian Dollar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇧🇷 <span>Brazilian Real</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇲🇽 <span>Mexican Peso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🇦🇷 <span>Argentine Peso</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Regions */}
        <Card>
          <CardHeader>
            <CardTitle>🏴‍☠️ Special Economic Zones & Territories</CardTitle>
            <CardDescription>
              Including all territories, dependencies, and special administrative regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
              <div className="flex items-center gap-2">🇭🇰 Hong Kong</div>
              <div className="flex items-center gap-2">🇲🇴 Macau</div>
              <div className="flex items-center gap-2">🇹🇼 Taiwan</div>
              <div className="flex items-center gap-2">🇵🇷 Puerto Rico</div>
              <div className="flex items-center gap-2">🇬🇺 Guam</div>
              <div className="flex items-center gap-2">🇻🇮 US Virgin Islands</div>
              <div className="flex items-center gap-2">🇬🇮 Gibraltar</div>
              <div className="flex items-center gap-2">🇫🇰 Falkland Islands</div>
              <div className="flex items-center gap-2">🇬🇬 Guernsey</div>
              <div className="flex items-center gap-2">🇯🇪 Jersey</div>
              <div className="flex items-center gap-2">🇮🇲 Isle of Man</div>
              <div className="flex items-center gap-2">🇦🇼 Aruba</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
