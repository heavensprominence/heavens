"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export type Locale = "en" | "es" | "fr" | "de" | "it" | "pt" | "ru" | "zh" | "ja" | "ar"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations = {
  en: {
    "home.welcome": "Welcome to HeavensLive",
    "home.subtitle": "The world's most transparent financial platform with CRED currency",
    "home.getStarted": "Get Started",
    "home.registrationBonus": "Registration Bonus",
    "home.credAmount": "₡100 CRED",
    "nav.signIn": "Sign In",
    "nav.signUp": "Sign Up",
    "nav.wallet": "Wallet",
    "nav.currencies": "Currencies",
    "nav.marketplace": "Marketplace",
    "nav.auctions": "Auctions",
    "nav.signOut": "Sign Out",
    "features.marketplace": "Global Marketplace",
    "features.currencies": "CRED Currencies",
    "features.trading": "Trading Platform",
    "features.grants": "Financial Grants",
  },
  es: {
    "home.welcome": "Bienvenido a HeavensLive",
    "home.subtitle": "La plataforma financiera más transparente del mundo con moneda CRED",
    "home.getStarted": "Comenzar",
    "home.registrationBonus": "Bono de Registro",
    "home.credAmount": "₡100 CRED",
    "nav.signIn": "Iniciar Sesión",
    "nav.signUp": "Registrarse",
    "nav.wallet": "Billetera",
    "nav.currencies": "Monedas",
    "nav.marketplace": "Mercado",
    "nav.auctions": "Subastas",
    "nav.signOut": "Cerrar Sesión",
    "features.marketplace": "Mercado Global",
    "features.currencies": "Monedas CRED",
    "features.trading": "Plataforma de Trading",
    "features.grants": "Subvenciones Financieras",
  },
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  const t = (key: string): string => {
    return translations[locale]?.[key as keyof (typeof translations)["en"]] || key
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
