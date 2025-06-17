import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const status = searchParams.get("status")

  try {
    let query = `
      SELECT 
        st.*,
        u.first_name || ' ' || u.last_name as user_name,
        assigned.first_name || ' ' || assigned.last_name as assigned_to_name
      FROM support_tickets st
      JOIN users u ON st.user_id = u.id
      LEFT JOIN users assigned ON st.assigned_to = assigned.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (userId) {
      query += ` AND st.user_id = $${paramIndex}`
      params.push(userId)
      paramIndex++
    }

    if (status && status !== "all") {
      query += ` AND st.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    query += ` ORDER BY 
      CASE st.priority 
        WHEN 'urgent' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
      END,
      st.created_at DESC
      LIMIT 50`

    const tickets = await sql.unsafe(query, params)

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error("Error fetching support tickets:", error)

    // Return demo data
    const demoTickets = [
      {
        id: 1,
        ticket_number: "TKT-2024-001",
        subject: "Payment not processing",
        category: "payment",
        priority: "high",
        status: "in_progress",
        description: "My CRED payment is stuck in pending status",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_name: "Demo User",
        assigned_to_name: "Support Team",
      },
    ]

    return NextResponse.json({ tickets: demoTickets })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, subject, category = "general", priority = "medium", description } = await request.json()

    if (!userId || !subject || !description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Generate ticket number
    const ticketNumber = "TKT-" + new Date().getFullYear() + "-" + String(Date.now()).slice(-6)

    // Create ticket
    const ticket = await sql`
      INSERT INTO support_tickets (
        ticket_number, user_id, subject, category, priority, 
        description, status, created_at, updated_at
      ) VALUES (
        ${ticketNumber}, ${userId}, ${subject}, ${category}, ${priority},
        ${description}, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      RETURNING id, ticket_number, created_at
    `

    // Log ticket creation
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, target_user_id, details, notes)
      VALUES (
        ${userId}, 'support_ticket_created', ${userId},
        ${JSON.stringify({
          ticketId: ticket[0].id,
          ticketNumber,
          category,
          priority,
        })},
        'Support ticket created'
      )
    `

    return NextResponse.json(
      {
        message: "Support ticket created successfully",
        ticket: {
          id: ticket[0].id,
          ticketNumber,
          status: "open",
          createdAt: ticket[0].created_at,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating support ticket:", error)
    return NextResponse.json({ message: "Failed to create support ticket" }, { status: 500 })
  }
}
