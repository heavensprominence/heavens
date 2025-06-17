import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await db.query("SELECT locale FROM user_locale_preferences WHERE user_id = $1", [session.user.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ locale: "en" })
    }

    return NextResponse.json({ locale: result.rows[0].locale })
  } catch (error) {
    console.error("Error fetching user locale:", error)
    return NextResponse.json({ error: "Failed to fetch locale preference" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { locale } = await request.json()

  if (!locale || typeof locale !== "string") {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 })
  }

  const validLocales = ["en", "es", "fr", "ar", "zh"]
  if (!validLocales.includes(locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 })
  }

  try {
    await db.query(
      `INSERT INTO user_locale_preferences (user_id, locale) 
       VALUES ($1, $2)
       ON CONFLICT (user_id) 
       DO UPDATE SET locale = $2, updated_at = CURRENT_TIMESTAMP`,
      [session.user.id, locale],
    )

    return NextResponse.json({ success: true, locale })
  } catch (error) {
    console.error("Error saving user locale:", error)
    return NextResponse.json({ error: "Failed to save locale preference" }, { status: 500 })
  }
}
