import { type NextRequest, NextResponse } from "next/server"
import { credParity } from "@/lib/cred-parity"

export async function POST(request: NextRequest) {
  try {
    const { amount, fromCurrency, toCurrency } = await request.json()

    if (!amount || !fromCurrency || !toCurrency) {
      return NextResponse.json(
        { error: "Missing required parameters: amount, fromCurrency, toCurrency" },
        { status: 400 },
      )
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 })
    }

    const conversion = await credParity.convertBetweenCurrencies(amount, fromCurrency, toCurrency)

    return NextResponse.json({
      success: true,
      conversion,
    })
  } catch (error) {
    console.error("Currency conversion error:", error)
    return NextResponse.json(
      {
        error: "Conversion failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
