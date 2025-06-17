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

    const { userId, status } = await request.json()

    if (!userId || !status) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (!["active", "suspended", "banned"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    // Get target user to check permissions
    const targetUser = await sql`
      SELECT role FROM users WHERE id = ${userId}
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

    // Update user status
    await sql`
      UPDATE users 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `

    // Log the action
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, target_user_id, details, created_at)
      VALUES (${session.user.id}, 'status_change', ${userId}, ${JSON.stringify({ old_status: targetUser[0].status, new_status: status })}, CURRENT_TIMESTAMP)
    `

    return NextResponse.json({ message: "Status updated successfully" })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
