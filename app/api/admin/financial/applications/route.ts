import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const applications = await sql`
      SELECT 
        fa.id,
        fa.application_type,
        fa.amount_requested,
        fa.currency_code,
        fa.purpose,
        fa.status,
        fa.priority_level,
        fa.created_at,
        fa.submitted_at,
        u1.first_name || ' ' || u1.last_name as applicant_name,
        u2.first_name || ' ' || u2.last_name as assigned_reviewer_name
      FROM financial_applications fa
      JOIN users u1 ON fa.applicant_id = u1.id
      LEFT JOIN users u2 ON fa.assigned_reviewer_id = u2.id
      ORDER BY 
        CASE fa.priority_level 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'normal' THEN 3 
          WHEN 'low' THEN 4 
        END,
        fa.created_at DESC
      LIMIT 100
    `

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ message: "Failed to fetch applications" }, { status: 500 })
  }
}
