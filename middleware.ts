import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

const locales = ["en", "es", "fr", "ar", "zh"]
const defaultLocale = "en"

function getLocale(request: NextRequest): string {
  // Check if there's a cookie with the locale
  const cookieLocale = request.cookies.get("heavenslive-locale")?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // Negotiator expects plain object so we need to transform headers
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })

  // Use negotiator and intl-localematcher to get the best locale
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip for API routes and static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // Get the preferred locale
  const locale = getLocale(request)

  // Create a response
  const response = NextResponse.next()

  // Set the locale cookie if it doesn't exist
  if (!request.cookies.has("heavenslive-locale")) {
    response.cookies.set("heavenslive-locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
