"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages, Check } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

export function LanguageSelector() {
  const { locale, setLocale, availableLocales } = useI18n()

  if (!availableLocales || availableLocales.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 text-white">
        {availableLocales.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className="flex items-center justify-between hover:bg-gray-800 focus:bg-gray-800"
          >
            <span>{lang.nativeName}</span>
            {locale === lang.code && <Check className="h-4 w-4 text-green-400" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSelector
