import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const messages = await sql`
      SELECT 
        m.*,
        sender.first_name || ' ' || sender.last_name as sender_name,
        recipient.first_name || ' ' || recipient.last_name as recipient_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      LEFT JOIN users recipient ON m.recipient_id = recipient.id
      WHERE m.conversation_id = ${params.conversationId} AND m.is_deleted = false
      ORDER BY m.created_at ASC
    `

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)

    // Return demo messages
    const demoMessages = [
      {
        id: 1,
        sender_id: 2,
        sender_name: "John Doe",
        content: "Hi! I'm interested in your iPhone 15 Pro listing.",
        message_type: "text",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        is_read: true,
      },
    ]

    return NextResponse.json({ messages: demoMessages })
  }
}

export async function POST(request: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const { senderId, recipientId, content, messageType = "text" } = await request.json()

    if (!senderId || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create message
    const message = await sql`
      INSERT INTO messages (
        conversation_id, sender_id, recipient_id, content, 
        message_type, is_read, created_at
      ) VALUES (
        ${params.conversationId}, ${senderId}, ${recipientId}, ${content},
        ${messageType}, false, CURRENT_TIMESTAMP
      )
      RETURNING id, created_at
    `

    // Update conversation last message time
    await sql`
      UPDATE conversations 
      SET last_message_at = CURRENT_TIMESTAMP
      WHERE id = ${params.conversationId}
    `

    return NextResponse.json(
      {
        message: "Message sent successfully",
        messageId: message[0].id,
        createdAt: message[0].created_at,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 })
  }
}
