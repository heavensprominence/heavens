import { NextResponse } from "next/server"
import { credParity } from "@/lib/cred-parity"

export async function GET() {
  try {
    const currencies = await credParity.getAllCurrencies()

    return NextResponse.json({
      success: true,
      currencies,
      count: currencies.length,
    })
  } catch (error) {
    console.error("Error fetching currencies:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch currencies" }, { status: 500 })
  }
}
