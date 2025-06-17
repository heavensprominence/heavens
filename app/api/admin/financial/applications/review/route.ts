import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { applicationId, action, reviewNotes, approvedAmount } = await request.json()

    if (!applicationId || !action) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get application details
    const application = await sql`
      SELECT * FROM financial_applications 
      WHERE id = ${applicationId} AND status IN ('submitted', 'under_review')
    `

    if (application.length === 0) {
      return NextResponse.json({ message: "Application not found or not reviewable" }, { status: 404 })
    }

    const app = application[0]
    let newStatus = ""
    let transactionHash = ""

    if (action === "approve") {
      newStatus = "approved"

      // Create disbursement transaction
      transactionHash = "TX" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8)

      // Update application
      await sql`
        UPDATE financial_applications 
        SET 
          status = ${newStatus},
          approved_amount = ${approvedAmount || app.amount_requested},
          approval_conditions = ${reviewNotes || null},
          approved_by = 1,
          approved_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${applicationId}
      `

      // Create transaction for disbursement
      await sql`
        INSERT INTO transactions (
          transaction_hash, to_wallet_id, amount, currency_code, 
          transaction_type, status, description, reference_id, reference_type,
          approval_level, approved_by, created_at
        ) 
        SELECT 
          ${transactionHash}, w.id, ${approvedAmount || app.amount_requested}, ${app.currency_code},
          ${app.application_type === "grant" ? "grant" : "loan_disbursement"}, 'pending',
          'Financial assistance disbursement', ${applicationId}, 'financial_application',
          'admin', 1, CURRENT_TIMESTAMP
        FROM wallets w 
        WHERE w.user_id = ${app.applicant_id} AND w.is_primary = true
      `

      // Create grant disbursement or loan record
      if (app.application_type === "grant") {
        await sql`
          INSERT INTO grant_disbursements (
            application_id, recipient_id, amount, currency_code, 
            disbursement_type, status, created_at
          ) VALUES (
            ${applicationId}, ${app.applicant_id}, ${approvedAmount || app.amount_requested}, 
            ${app.currency_code}, 'lump_sum', 'pending', CURRENT_TIMESTAMP
          )
        `
      } else {
        // Create loan record
        const termMonths = app.requested_term_months || 24
        const monthlyPayment = (approvedAmount || app.amount_requested) / termMonths

        await sql`
          INSERT INTO loans (
            application_id, borrower_id, principal_amount, currency_code,
            term_months, monthly_payment, outstanding_balance,
            disbursement_date, first_payment_date, maturity_date,
            status, created_at
          ) VALUES (
            ${applicationId}, ${app.applicant_id}, ${approvedAmount || app.amount_requested}, 
            ${app.currency_code}, ${termMonths}, ${monthlyPayment}, 
            ${approvedAmount || app.amount_requested},
            CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month', 
            CURRENT_DATE + INTERVAL '${termMonths} months',
            'active', CURRENT_TIMESTAMP
          )
        `
      }
    } else if (action === "reject") {
      newStatus = "rejected"

      await sql`
        UPDATE financial_applications 
        SET 
          status = ${newStatus},
          review_notes = ${reviewNotes || null},
          reviewed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${applicationId}
      `
    }

    // Log admin action
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, details, created_at)
      VALUES (1, 'application_review', ${JSON.stringify({
        applicationId,
        action,
        newStatus,
        reviewNotes,
        approvedAmount: approvedAmount || app.amount_requested,
      })}, CURRENT_TIMESTAMP)
    `

    return NextResponse.json({
      message: `Application ${action}d successfully`,
      status: newStatus,
      transactionHash: transactionHash || null,
    })
  } catch (error) {
    console.error("Error processing application review:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
