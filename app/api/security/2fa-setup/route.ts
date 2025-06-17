import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { AuditLogAction, createAuditLog } from "@/lib/audit-log"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()
    const { enabled, opt_out, security_level } = body

    if (typeof enabled !== "boolean" && typeof opt_out !== "boolean") {
      return new NextResponse("Invalid parameters", { status: 400 })
    }

    if (security_level !== "basic" && security_level !== "enhanced") {
      return new NextResponse("Invalid security level", { status: 400 })
    }

    // Fetch existing user preferences
    const existingPreferences = await db.userPreference.findUnique({
      where: {
        userId: userId,
      },
    })

    if (opt_out) {
      // Disable 2FA
      await db.userPreference.upsert({
        where: {
          userId: userId,
        },
        update: {
          isTwoFactorEnabled: false,
          securityLevel: security_level,
        },
        create: {
          userId: userId,
          isTwoFactorEnabled: false,
          securityLevel: security_level,
        },
      })

      await createAuditLog({
        userId: userId,
        action: AuditLogAction.TWO_FACTOR_DISABLED,
        entityId: userId,
        entityType: "user",
        name: session.user.name || "Unknown User",
      })

      return NextResponse.json({ success: true, message: "2FA disabled successfully" })
    } else if (enabled) {
      // Enable 2FA
      await db.userPreference.upsert({
        where: {
          userId: userId,
        },
        update: {
          isTwoFactorEnabled: true,
          securityLevel: security_level,
        },
        create: {
          userId: userId,
          isTwoFactorEnabled: true,
          securityLevel: security_level,
        },
      })

      await createAuditLog({
        userId: userId,
        action: AuditLogAction.TWO_FACTOR_ENABLED,
        entityId: userId,
        entityType: "user",
        name: session.user.name || "Unknown User",
      })

      return NextResponse.json({ success: true, message: "2FA enabled successfully" })
    } else {
      return new NextResponse("Invalid request", { status: 400 })
    }
  } catch (error) {
    console.error("[2FA_SETUP_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
