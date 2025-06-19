import { NextResponse } from "next/server"

// Mock transaction data for demo purposes
const mockTransactions = [
  {
    id: "1",
    amount: 10000,
    currency: "USD-CRED",
    type: "bonus",
    description: "Registration bonus - Position #1",
    to_user_name: "User #12345",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    amount: 5000,
    currency: "EUR-CRED",
    type: "bonus",
    description: "Registration bonus - Position #2",
    to_user_name: "User #12346",
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "3",
    amount: 150,
    currency: "CAD-CRED",
    type: "send",
    description: "CRED transfer",
    from_user_name: "User #12348",
    to_user_name: "User #12349",
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "4",
    amount: 75,
    currency: "GBP-CRED",
    type: "receive",
    description: "Payment received",
    from_user_name: "User #12350",
    to_user_name: "User #12351",
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "5",
    amount: 200,
    currency: "JPY-CRED",
    type: "purchase",
    description: "Marketplace purchase",
    from_user_name: "User #12352",
    to_user_name: "User #12353",
    created_at: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "6",
    amount: 85,
    currency: "AUD-CRED",
    type: "sale",
    description: "Auction sale",
    from_user_name: "User #12354",
    to_user_name: "User #12355",
    created_at: new Date(Date.now() - 1500000).toISOString(),
  },
  {
    id: "7",
    amount: 320,
    currency: "CHF-CRED",
    type: "send",
    description: "International transfer",
    from_user_name: "User #12356",
    to_user_name: "User #12357",
    created_at: new Date(Date.now() - 1800000).toISOString(),
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
