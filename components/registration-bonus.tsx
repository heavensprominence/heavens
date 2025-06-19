"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Users, Coins } from "lucide-react"

export function RegistrationBonus() {
  const [position, setPosition] = useState(1)

  useEffect(() => {
    // Increase position every 30 seconds
    const positionInterval = setInterval(() => {
      setPosition((prev) => prev + Math.floor(Math.random() * 3) + 1)
    }, 30000)

    return () => {
      clearInterval(positionInterval)
    }
  }, [])

  // Calculate bonus based on EXACT position requirements
  const calculateBonus = (pos: number) => {
    if (pos === 1) return 10000
    if (pos === 2) return 5000
    if (pos === 3) return 2500
    if (pos >= 4 && pos <= 100) return 1000
    if (pos >= 101 && pos <= 1000) return 50
    if (pos >= 1001) return 10 // This covers 1001-1000000 and 1000001+ (all get 10 CRED)
    return 10
  }

  const bonus = calculateBonus(position)

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-500 p-4 rounded-full">
                <Gift className="h-8 w-8 text-gray-900" />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 text-white">Registration Bonus Based on Join Order!</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <Coins className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-500">₡{bonus.toLocaleString()}</div>
                <div className="text-gray-400">Your Bonus Amount</div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-500">#{position}</div>
                <div className="text-gray-400">Next Available Position</div>
              </div>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Bonus Structure:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-yellow-500 font-bold">#1</div>
                  <div className="text-gray-400">₡10,000</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-500 font-bold">#2</div>
                  <div className="text-gray-400">₡5,000</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-500 font-bold">#3</div>
                  <div className="text-gray-400">₡2,500</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-500 font-bold">#4-100</div>
                  <div className="text-gray-400">₡1,000</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-500 font-bold">#101-1,000</div>
                  <div className="text-gray-400">₡50</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-500 font-bold">#1,001+</div>
                  <div className="text-gray-400">₡10</div>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-300 mb-6">
              Join now as member <span className="text-blue-500 font-bold">#{position}</span> and receive{" "}
              <span className="text-yellow-500 font-bold">₡{bonus.toLocaleString()} CRED</span> instantly!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                Claim Your ₡{bonus.toLocaleString()} Bonus
                <Gift className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Learn More About CRED
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              * Bonus amounts are fixed per position. Join early for maximum rewards!
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
