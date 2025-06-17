"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useI18n } from "@/lib/i18n/i18n-context"

export function useLocaleSync() {
  const { data: session } = useSession()
  const { locale, setLocale } = useI18n()

  // Fetch user's locale preference when they log in
  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/preferences/locale")
        .then((res) => res.json())
        .then((data) => {
          if (data.locale && data.locale !== locale) {
            setLocale(data.locale)
          }
        })
        .catch((err) => console.error("Failed to fetch user locale preference:", err))
    }
  }, [session, setLocale, locale])

  // Save user's locale preference when it changes
  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/preferences/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      }).catch((err) => console.error("Failed to save user locale preference:", err))
    }
  }, [locale, session])

  return null
}
