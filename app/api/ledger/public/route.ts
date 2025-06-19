import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Always return mock data for now to avoid database issues
    const mockTransactions = [
      {
        id: "1",
        type: "registration_bonus",
        amount: 15000,
        currency: "USD-CRED",
        description: "Registration bonus for joiner #1",
        status: "approved",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        type: "minting",
        amount: 1000,
        currency: "EUR-CRED",
        description: "CRED minting operation",
        status: "approved",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "3",
        type: "transfer",
        amount: 50,
        currency: "GBP-CRED",
        description: "Transfer between users",
        status: "approved",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "4",
        type: "trading",
        amount: 250,
        currency: "CAD-CRED",
        description: "Currency trading transaction",
        status: "approved",
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        id: "5",
        type: "grant",
        amount: 100,
        currency: "AUD-CRED",
        description: "Community grant distribution",
        status: "approved",
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ]

    return NextResponse.json({
      transactions: mockTransactions,
    })
  } catch (error) {
    console.error("Failed to fetch public ledger:", error)
    return NextResponse.json({
      transactions: [],
      error: "Failed to fetch transactions",
    })
  }
}
