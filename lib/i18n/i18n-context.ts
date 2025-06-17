"use client"

import { createContext, useContext } from "react"

export type Locale = "en" | "es" | "fr" | "ar" | "zh"

export type AvailableLocale = {
  code: Locale
  name: string
  nativeName: string
}

export type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string>) => string
  availableLocales: AvailableLocale[]
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
