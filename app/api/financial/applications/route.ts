import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const status = searchParams.get("status")
  const type = searchParams.get("type")

  try {
    let query = `
      SELECT 
        fa.*,
        u.first_name || ' ' || u.last_name as applicant_name,
        reviewer.first_name || ' ' || reviewer.last_name as reviewer_name
      FROM financial_applications fa
      JOIN users u ON fa.applicant_id = u.id
      LEFT JOIN users reviewer ON fa.assigned_reviewer_id = reviewer.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (userId) {
      query += ` AND fa.applicant_id = $${paramIndex}`
      params.push(userId)
      paramIndex++
    }

    if (status) {
      query += ` AND fa.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (type) {
      query += ` AND fa.application_type = $${paramIndex}`
      params.push(type)
      paramIndex++
    }

    query += ` ORDER BY 
      CASE fa.priority_level 
        WHEN 'urgent' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'normal' THEN 3 
        WHEN 'low' THEN 4 
      END,
      fa.created_at DESC
      LIMIT 50`

    const applications = await sql.unsafe(query, params)

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ message: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      applicantId,
      applicationType, // 'grant' or 'loan'
      amountRequested,
      currencyCode = "USD-CRED",
      purpose,
      businessPlan,
      employmentStatus,
      annualIncome,
      requestedTermMonths,
      priorityLevel = "normal",
    } = await request.json()

    if (!applicantId || !applicationType || !amountRequested || !purpose) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check application limits
    const maxAmount = applicationType === "grant" ? 50000 : 100000
    if (amountRequested > maxAmount) {
      return NextResponse.json(
        {
          message: `Amount exceeds maximum ${applicationType} limit of ${maxAmount} ${currencyCode}`,
        },
        { status: 400 },
      )
    }

    // Create application
    const application = await sql`
      INSERT INTO financial_applications (
        applicant_id, application_type, amount_requested, currency_code,
        purpose, business_plan, employment_status, annual_income,
        requested_term_months, priority_level, status, submitted_at
      ) VALUES (
        ${applicantId}, ${applicationType}, ${amountRequested}, ${currencyCode},
        ${purpose}, ${businessPlan}, ${employmentStatus}, ${annualIncome},
        ${requestedTermMonths}, ${priorityLevel}, 'submitted', CURRENT_TIMESTAMP
      )
      RETURNING id, created_at
    `

    // Log application submission
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, target_user_id, details, notes)
      VALUES (
        ${applicantId}, 'financial_application_submitted', ${applicantId},
        ${JSON.stringify({
          applicationId: application[0].id,
          type: applicationType,
          amount: amountRequested,
          currency: currencyCode,
        })},
        'Financial assistance application submitted'
      )
    `

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application: {
          id: application[0].id,
          status: "submitted",
          createdAt: application[0].created_at,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ message: "Failed to submit application" }, { status: 500 })
  }
}
