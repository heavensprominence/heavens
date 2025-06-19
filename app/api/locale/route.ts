import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const cookieStore = cookies()
  const locale = cookieStore.get("heavenslive-locale")?.value || "en"

  return NextResponse.json({ locale })
}

export async function POST(request: NextRequest) {
  const { locale } = await request.json()

  if (!locale || typeof locale !== "string") {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 })
  }

  const validLocales = ["en", "es", "fr", "ar", "zh"]
  if (!validLocales.includes(locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 })
  }

  const cookieStore = cookies()
  cookieStore.set("heavenslive-locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  return NextResponse.json({ success: true, locale })
}
