import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "super_admin", "owner"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { userId, first_name, last_name, email, phone, country_code, role, status, notes } = await request.json()

    if (!userId || !first_name || !last_name || !email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get target user to check permissions
    const targetUser = await sql`
      SELECT role, status FROM users WHERE id = ${userId}
    `

    if (targetUser.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if current user can modify target user
    const canModify =
      session.user.role === "owner" ||
      (session.user.role === "super_admin" && !["owner"].includes(targetUser[0].role)) ||
      (session.user.role === "admin" && targetUser[0].role === "user")

    if (!canModify) {
      return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 })
    }

    // Update user information
    await sql`
      UPDATE users 
      SET 
        first_name = ${first_name},
        last_name = ${last_name},
        email = ${email},
        phone = ${phone || null},
        country_code = ${country_code || null},
        role = ${role},
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `

    // Log the action with notes
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, target_user_id, details, notes, created_at)
      VALUES (
        ${session.user.id}, 
        'user_edit', 
        ${userId}, 
        ${JSON.stringify({
          changes: { first_name, last_name, email, phone, country_code, role, status },
          old_values: targetUser[0],
        })}, 
        ${notes || null},
        CURRENT_TIMESTAMP
      )
    `

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
