"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { X } from "lucide-react"
import { Button } from "./ui/button"

export function LanguageDetectionBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [detectedLocale, setDetectedLocale] = useState<string | null>(null)
  const { locale, setLocale, availableLocales } = useI18n()

  useEffect(() => {
    // Check if we've shown this banner before
    const bannerDismissed = localStorage.getItem("language-banner-dismissed")
    if (bannerDismissed) return

    // Detect browser language
    const browserLang = navigator.language.split("-")[0]
    const isSupported = availableLocales.some((l) => l.code === browserLang)

    // Only show banner if detected language is different from current and is supported
    if (isSupported && browserLang !== locale) {
      setDetectedLocale(browserLang)
      setShowBanner(true)
    }
  }, [availableLocales, locale])

  const dismissBanner = () => {
    setShowBanner(false)
    localStorage.setItem("language-banner-dismissed", "true")
  }

  const switchLanguage = () => {
    if (detectedLocale) {
      setLocale(detectedLocale)
    }
    dismissBanner()
  }

  if (!showBanner) return null

  const localeName = availableLocales.find((l) => l.code === detectedLocale)?.name

  return (
    <div className="fixed bottom-4 inset-x-4 md:bottom-8 md:inset-x-8 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
      <p>
        We detected your language as <strong>{localeName}</strong>. Would you like to switch?
      </p>
      <div className="flex items-center gap-2 ml-4">
        <Button variant="secondary" size="sm" onClick={switchLanguage}>
          Switch to {localeName}
        </Button>
        <Button variant="ghost" size="icon" onClick={dismissBanner}>
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  )
}
