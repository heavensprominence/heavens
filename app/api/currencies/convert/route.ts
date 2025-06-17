import { type NextRequest, NextResponse } from "next/server"
import { credParity } from "@/lib/cred-parity"

export async function POST(request: NextRequest) {
  try {
    const { amount, fromCurrency, toCurrency } = await request.json()

    if (!amount || !fromCurrency || !toCurrency) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ success: false, error: "Amount must be greater than 0" }, { status: 400 })
    }

    const conversion = await credParity.convertBetweenCurrencies(Number.parseFloat(amount), fromCurrency, toCurrency)

    return NextResponse.json({
      success: true,
      conversion,
    })
  } catch (error) {
    console.error("Error converting currency:", error)
    return NextResponse.json({ success: false, error: "Failed to convert currency" }, { status: 500 })
  }
}
