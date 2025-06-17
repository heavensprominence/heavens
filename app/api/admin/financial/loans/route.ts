import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const loans = await sql`
      SELECT 
        l.id,
        l.principal_amount,
        l.outstanding_balance,
        l.total_paid,
        l.monthly_payment,
        l.currency_code,
        l.status,
        l.disbursement_date,
        l.maturity_date,
        l.term_months,
        u.first_name || ' ' || u.last_name as borrower_name,
        -- Calculate next payment date and payment counts
        l.first_payment_date + (
          SELECT COUNT(*) * INTERVAL '1 month' 
          FROM loan_payments lp 
          WHERE lp.loan_id = l.id AND lp.status = 'paid'
        ) as next_payment_date,
        (SELECT COUNT(*) FROM loan_payments lp WHERE lp.loan_id = l.id AND lp.status = 'paid') as payments_made,
        l.term_months as total_payments
      FROM loans l
      JOIN users u ON l.borrower_id = u.id
      ORDER BY 
        CASE l.status 
          WHEN 'active' THEN 1 
          WHEN 'completed' THEN 2 
          WHEN 'defaulted' THEN 3 
        END,
        l.disbursement_date DESC
    `

    return NextResponse.json({ loans })
  } catch (error) {
    console.error("Error fetching loans:", error)
    return NextResponse.json({ message: "Failed to fetch loans" }, { status: 500 })
  }
}
