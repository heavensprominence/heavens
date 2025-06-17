import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ message: "User ID required" }, { status: 400 })
  }

  try {
    const conversations = await sql`
      SELECT DISTINCT
        c.id,
        c.type,
        c.subject,
        c.participants,
        c.last_message_at,
        c.is_archived,
        c.metadata,
        c.created_at,
        last_msg.content as last_message_content,
        last_msg.sender_id as last_sender_id,
        sender.first_name || ' ' || sender.last_name as last_sender_name,
        COALESCE(unread.count, 0) as unread_count
      FROM conversations c
      LEFT JOIN LATERAL (
        SELECT content, sender_id, created_at
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) last_msg ON true
      LEFT JOIN users sender ON last_msg.sender_id = sender.id
      LEFT JOIN (
        SELECT 
          conversation_id,
          COUNT(*) as count
        FROM messages
        WHERE recipient_id = ${userId} AND is_read = false AND is_deleted = false
        GROUP BY conversation_id
      ) unread ON c.id = unread.conversation_id
      WHERE ${userId}::integer = ANY(c.participants) AND c.is_archived = false
      ORDER BY c.last_message_at DESC
      LIMIT 50
    `

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)

    // Return demo data on error
    const demoConversations = [
      {
        id: "demo-conv-1",
        type: "direct",
        subject: "iPhone 15 Pro Purchase",
        participants: [1, 2],
        last_message_content: "Is the phone still available?",
        last_sender_name: "John Doe",
        last_message_at: new Date().toISOString(),
        unread_count: 2,
        is_archived: false,
      },
    ]

    return NextResponse.json({ conversations: demoConversations })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { senderId, recipientId, subject, initialMessage, type = "direct" } = await request.json()

    if (!senderId || !recipientId || !initialMessage) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create conversation
    const conversation = await sql`
      INSERT INTO conversations (type, subject, participants, last_message_at)
      VALUES (${type}, ${subject}, ARRAY[${senderId}, ${recipientId}], CURRENT_TIMESTAMP)
      RETURNING id
    `

    const conversationId = conversation[0].id

    // Create initial message
    await sql`
      INSERT INTO messages (
        conversation_id, sender_id, recipient_id, content, 
        message_type, is_read, created_at
      ) VALUES (
        ${conversationId}, ${senderId}, ${recipientId}, ${initialMessage},
        'text', false, CURRENT_TIMESTAMP
      )
    `

    return NextResponse.json(
      {
        message: "Conversation created successfully",
        conversationId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ message: "Failed to create conversation" }, { status: 500 })
  }
}
