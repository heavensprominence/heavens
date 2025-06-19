import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const result = await sql`
      SELECT 
        br.*,
        u.first_name || ' ' || u.last_name as reporter_name,
        u.email as reporter_email,
        resolver.first_name || ' ' || resolver.last_name as resolver_name
      FROM bug_reports br
      LEFT JOIN users u ON br.user_id = u.id
      LEFT JOIN users resolver ON br.resolved_by = resolver.id
      WHERE br.id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Bug report not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error fetching bug report:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bug report" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { status, resolution_notes, resolved_by } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (status) updateData.status = status
    if (resolution_notes) updateData.resolution_notes = resolution_notes
    if (resolved_by) updateData.resolved_by = resolved_by
    if (status === "resolved" || status === "closed") {
      updateData.resolved_at = new Date().toISOString()
    }

    const result = await sql`
      UPDATE bug_reports 
      SET 
        status = COALESCE(${status}, status),
        resolution_notes = COALESCE(${resolution_notes}, resolution_notes),
        resolved_by = COALESCE(${resolved_by}, resolved_by),
        resolved_at = CASE WHEN ${status} IN ('resolved', 'closed') THEN CURRENT_TIMESTAMP ELSE resolved_at END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Bug report updated successfully",
    })
  } catch (error) {
    console.error("Error updating bug report:", error)
    return NextResponse.json({ success: false, error: "Failed to update bug report" }, { status: 500 })
  }
}
