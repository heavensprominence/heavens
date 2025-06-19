"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { I18nContext, type Locale } from "./i18n-context"
import { availableLocales } from "./languages"
import en from "./translations/en"
import es from "./translations/es"
import fr from "./translations/fr"
import ar from "./translations/ar"
import zh from "./translations/zh"

// For now, we'll use fallback translations for languages we don't have full translations for
const translations = {
  en,
  es,
  fr,
  ar,
  zh,
  // All other languages will fall back to English
  hi: en,
  pt: en,
  ru: en,
  ja: en,
  de: en,
  ko: en,
  it: en,
  tr: en,
  pl: en,
  nl: en,
  sv: en,
  da: en,
  no: en,
  fi: en,
  he: en,
  th: en,
  vi: en,
  id: en,
  ms: en,
  tl: en,
  sw: en,
  am: en,
  yo: en,
  ig: en,
  ha: en,
  zu: en,
  xh: en,
  af: en,
  bn: en,
  ur: en,
  fa: en,
  ps: en,
  ku: en,
  az: en,
  ka: en,
  hy: en,
  el: en,
  bg: en,
  ro: en,
  hu: en,
  cs: en,
  sk: en,
  sl: en,
  hr: en,
  sr: en,
  bs: en,
  mk: en,
  sq: en,
  mt: en,
  is: en,
  ga: en,
  cy: en,
  eu: en,
  ca: en,
  gl: en,
  oc: en,
  co: en,
  sc: en,
  et: en,
  lv: en,
  lt: en,
  be: en,
  uk: en,
  kk: en,
  ky: en,
  uz: en,
  tk: en,
  tg: en,
  mn: en,
  bo: en,
  my: en,
  km: en,
  lo: en,
  si: en,
  ta: en,
  te: en,
  kn: en,
  ml: en,
  or: en,
  gu: en,
  pa: en,
  ne: en,
  as: en,
  fo: en,
  gd: en,
  br: en,
  kw: en,
} as Record<Locale, any>

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && Object.keys(translations).includes(savedLocale)) {
      setLocaleState(savedLocale)
      document.documentElement.lang = savedLocale

      // Set RTL for right-to-left languages
      const selectedLocale = availableLocales.find((l) => l.code === savedLocale)
      document.documentElement.dir = selectedLocale?.rtl ? "rtl" : "ltr"
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
    document.documentElement.lang = newLocale

    // Set RTL for right-to-left languages
    const selectedLocale = availableLocales.find((l) => l.code === newLocale)
    document.documentElement.dir = selectedLocale?.rtl ? "rtl" : "ltr"
  }

  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split(".")
    let value: any = translations[locale] || translations.en

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
