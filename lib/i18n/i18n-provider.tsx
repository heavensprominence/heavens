"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { I18nContext, type Locale, type AvailableLocale } from "./i18n-context"
import en from "./translations/en"
import es from "./translations/es"
import fr from "./translations/fr"
import ar from "./translations/ar"
import zh from "./translations/zh"

const translations = {
  en,
  es,
  fr,
  ar,
  zh,
}

const availableLocales: AvailableLocale[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
]

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && Object.keys(translations).includes(savedLocale)) {
      setLocaleState(savedLocale)
      document.documentElement.lang = savedLocale
      document.documentElement.dir = savedLocale === "ar" ? "rtl" : "ltr"
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
    document.documentElement.lang = newLocale
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr"
  }

  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split(".")
    let value: any = translations[locale]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        // Fallback to English
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Key not found even in fallback
          }
        }
        break
      }
    }

    if (typeof value === "string" && params) {
      return Object.entries(params).reduce(
        (acc, [paramKey, paramValue]) => acc.replace(new RegExp(`{{${paramKey}}}`, "g"), paramValue),
        value,
      )
    }

    return typeof value === "string" ? value : key
  }

  if (!mounted) {
    return null
  }

  return <I18nContext.Provider value={{ locale, setLocale, t, availableLocales }}>{children}</I18nContext.Provider>
}
