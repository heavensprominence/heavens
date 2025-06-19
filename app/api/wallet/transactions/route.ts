import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return mock transaction data
    const mockTransactions = [
      {
        id: "1",
        type: "registration_bonus",
        amount: 15000,
        currency: "USD-CRED",
        description: "Welcome bonus for joining Heavenslive",
        status: "approved",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        type: "transfer",
        amount: -50,
        currency: "USD-CRED",
        description: "Transfer to demo@example.com",
        status: "approved",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ]

    return NextResponse.json({
      transactions: mockTransactions,
    })
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
