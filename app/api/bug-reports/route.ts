import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = `
      SELECT 
        br.*,
        u.first_name || ' ' || u.last_name as reporter_name,
        resolver.first_name || ' ' || resolver.last_name as resolver_name
      FROM bug_reports br
      LEFT JOIN users u ON br.user_id = u.id
      LEFT JOIN users resolver ON br.resolved_by = resolver.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (status) {
      query += ` AND br.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (severity) {
      query += ` AND br.severity = $${paramIndex}`
      params.push(severity)
      paramIndex++
    }

    if (category) {
      query += ` AND br.category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    query += ` ORDER BY br.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await sql(query, params)

    return NextResponse.json({
      success: true,
      data: result,
      total: result.length,
    })
  } catch (error) {
    console.error("Error fetching bug reports:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bug reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      severity = "medium",
      category = "general",
      user_id,
      user_email,
      page_url,
      steps_to_reproduce,
      expected_behavior,
      actual_behavior,
      screenshot_url,
    } = body

    // Get browser info from headers
    const userAgent = request.headers.get("user-agent") || ""
    const browserInfo = {
      userAgent,
      timestamp: new Date().toISOString(),
      referrer: request.headers.get("referer") || "",
    }

    const result = await sql`
      INSERT INTO bug_reports (
        title, description, severity, category, user_id, user_email,
        user_agent, browser_info, page_url, steps_to_reproduce,
        expected_behavior, actual_behavior, screenshot_url
      ) VALUES (
        ${title}, ${description}, ${severity}, ${category}, ${user_id}, ${user_email},
        ${userAgent}, ${JSON.stringify(browserInfo)}, ${page_url}, ${steps_to_reproduce},
        ${expected_behavior}, ${actual_behavior}, ${screenshot_url}
      ) RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Bug report submitted successfully",
    })
  } catch (error) {
    console.error("Error creating bug report:", error)
    return NextResponse.json({ success: false, error: "Failed to submit bug report" }, { status: 500 })
  }
}
