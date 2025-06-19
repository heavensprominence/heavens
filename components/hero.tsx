"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Coins } from "lucide-react"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-500 p-4 rounded-full">
            <Coins className="h-12 w-12 text-gray-900" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          HeavensLive
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          The world's first universal currency platform with CRED (₡) - Trade 180+ global currencies with zero fees
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
            Start Trading Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
