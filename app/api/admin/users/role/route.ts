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

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (!["user", "admin", "super_admin", "owner"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }

    // Get target user to check permissions
    const targetUser = await sql`
      SELECT role FROM users WHERE id = ${userId}
    `

    if (targetUser.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if current user can assign this role
    const canAssignRole =
      session.user.role === "owner" ||
      (session.user.role === "super_admin" && !["owner"].includes(role) && !["owner"].includes(targetUser[0].role)) ||
      (session.user.role === "admin" && role === "user" && targetUser[0].role === "user")

    if (!canAssignRole) {
      return NextResponse.json({ message: "Insufficient permissions to assign this role" }, { status: 403 })
    }

    // Update user role
    await sql`
      UPDATE users 
      SET role = ${role}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `

    // Log the action
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, target_user_id, details, created_at)
      VALUES (${session.user.id}, 'role_change', ${userId}, ${JSON.stringify({ old_role: targetUser[0].role, new_role: role })}, CURRENT_TIMESTAMP)
    `

    return NextResponse.json({ message: "Role updated successfully" })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
