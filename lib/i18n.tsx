"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Locale = "en" | "es" | "fr" | "de" | "zh" | "ar"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.currencies": "Currencies",
    "nav.classifieds": "Classifieds",
    "nav.auctions": "Auctions",
    "nav.wallet": "Wallet",
    "nav.ledger": "Ledger",
    "nav.signIn": "Sign In",
    "nav.signUp": "Sign Up",
    "nav.signOut": "Sign Out",
    "nav.profile": "Profile",
    "nav.admin": "Admin Panel",

    // Home page
    "home.welcome": "Trade Globally with CRED Currency",
    "home.subtitle":
      "Join the world's most comprehensive currency platform. Trade, buy, sell, and auction with our stable CRED system backed by 180+ global currencies.",
    "home.getStarted": "Get Started Free",
    "home.exploreCurrencies": "Explore Currencies",
    "home.registrationBonus": "Registration Bonus",
    "home.credAmount": "₡100",
    "home.globalCurrencies": "Global Currencies",
    "home.secureTransactions": "Secure Transactions",
    "home.supporting": "Supporting 180+ Global Currencies",

    // Features
    "features.marketplace": "Global Marketplace",
    "features.marketplaceDesc": "Buy and sell goods worldwide with CRED payments",
    "features.currencies": "CRED Currencies",
    "features.currenciesDesc": "Universal cryptocurrency with transparent parity system",
    "features.trading": "Trading Platform",
    "features.tradingDesc": "Advanced trading tools for global commerce",
    "features.grants": "Financial Grants",
    "features.grantsDesc": "Interest-free financial assistance for community growth",

    // Footer
    "footer.description": "The world's most comprehensive currency platform supporting 180+ global currencies.",
    "footer.platform": "Platform",
    "footer.support": "Support",
    "footer.legal": "Legal",
    "footer.help": "Help Center",
    "footer.contact": "Contact Us",
    "footer.security": "Security",
    "footer.api": "API Docs",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.compliance": "Compliance",
    "footer.licenses": "Licenses",
    "footer.copyright": "© 2024 Heavenslive. All rights reserved.",
    "footer.currencies": "180+ Currencies",
    "footer.ledger": "Public Ledger",

    // Public Ledger
    "ledger.title": "Public Transaction Ledger",
    "ledger.subtitle": "Complete transparency - all transactions are publicly visible",
    "ledger.live": "LIVE",
    "ledger.refresh": "Refresh",
    "ledger.loading": "Loading transactions...",
    "ledger.error": "Error loading transactions",
    "ledger.noTransactions": "No transactions found",
    "ledger.amount": "Amount",
    "ledger.from": "From",
    "ledger.to": "To",
    "ledger.type": "Type",
    "ledger.time": "Time",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.currencies": "Monedas",
    "nav.classifieds": "Clasificados",
    "nav.auctions": "Subastas",
    "nav.wallet": "Billetera",
    "nav.ledger": "Libro Mayor",
    "nav.signIn": "Iniciar Sesión",
    "nav.signUp": "Registrarse",
    "nav.signOut": "Cerrar Sesión",
    "nav.profile": "Perfil",
    "nav.admin": "Panel de Admin",

    // Home page
    "home.welcome": "Comercia Globalmente con Moneda CRED",
    "home.subtitle":
      "Únete a la plataforma de monedas más completa del mundo. Comercia, compra, vende y subasta con nuestro sistema CRED estable respaldado por más de 180 monedas globales.",
    "home.getStarted": "Comenzar Gratis",
    "home.exploreCurrencies": "Explorar Monedas",
    "home.registrationBonus": "Bono de Registro",
    "home.credAmount": "₡100",
    "home.globalCurrencies": "Monedas Globales",
    "home.secureTransactions": "Transacciones Seguras",
    "home.supporting": "Soportando más de 180 Monedas Globales",

    // Features
    "features.marketplace": "Mercado Global",
    "features.marketplaceDesc": "Compra y vende productos en todo el mundo con pagos CRED",
    "features.currencies": "Monedas CRED",
    "features.currenciesDesc": "Criptomoneda universal con sistema de paridad transparente",
    "features.trading": "Plataforma de Trading",
    "features.tradingDesc": "Herramientas avanzadas de trading para comercio global",
    "features.grants": "Subvenciones Financieras",
    "features.grantsDesc": "Asistencia financiera sin intereses para el crecimiento comunitario",

    // Footer
    "footer.description": "La plataforma de monedas más completa del mundo que soporta más de 180 monedas globales.",
    "footer.platform": "Plataforma",
    "footer.support": "Soporte",
    "footer.legal": "Legal",
    "footer.help": "Centro de Ayuda",
    "footer.contact": "Contáctanos",
    "footer.security": "Seguridad",
    "footer.api": "Documentación API",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos de Servicio",
    "footer.compliance": "Cumplimiento",
    "footer.licenses": "Licencias",
    "footer.copyright": "© 2024 Heavenslive. Todos los derechos reservados.",
    "footer.currencies": "180+ Monedas",
    "footer.ledger": "Libro Mayor Público",

    // Public Ledger
    "ledger.title": "Libro Mayor de Transacciones Públicas",
    "ledger.subtitle": "Transparencia completa - todas las transacciones son públicamente visibles",
    "ledger.live": "EN VIVO",
    "ledger.refresh": "Actualizar",
    "ledger.loading": "Cargando transacciones...",
    "ledger.error": "Error al cargar transacciones",
    "ledger.noTransactions": "No se encontraron transacciones",
    "ledger.amount": "Cantidad",
    "ledger.from": "De",
    "ledger.to": "Para",
    "ledger.type": "Tipo",
    "ledger.time": "Tiempo",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.cancel": "Cancelar",
    "common.save": "Guardar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
  },
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  const t = (key: string): string => {
    return translations[locale]?.[key as keyof typeof translations.en] || key
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
