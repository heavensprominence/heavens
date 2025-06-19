import { NextResponse } from "next/server"

// Mock transaction data for demo purposes
const mockTransactions = [
  {
    id: "1",
    amount: 100,
    currency: "CRED",
    type: "bonus",
    description: "Registration bonus",
    to_user_name: "User #12345",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    amount: 25.5,
    currency: "USD",
    type: "purchase",
    description: "Marketplace purchase",
    from_user_name: "User #12346",
    to_user_name: "User #12347",
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "3",
    amount: 50,
    currency: "EUR",
    type: "send",
    description: "Currency transfer",
    from_user_name: "User #12348",
    to_user_name: "User #12349",
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "4",
    amount: 75,
    currency: "CRED",
    type: "receive",
    description: "Payment received",
    from_user_name: "User #12350",
    to_user_name: "User #12351",
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "5",
    amount: 200,
    currency: "GBP",
    type: "sale",
    description: "Auction sale",
    from_user_name: "User #12352",
    to_user_name: "User #12353",
    created_at: new Date(Date.now() - 1200000).toISOString(),
  },
]

export async function GET() {
  try {
    // In a real app, this would fetch from the database
    // For now, return mock data
    return NextResponse.json({
      success: true,
      transactions: mockTransactions,
    })
  } catch (error) {
    console.error("Error fetching public ledger:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch transactions",
        transactions: [],
      },
      { status: 500 },
    )
  }
}
