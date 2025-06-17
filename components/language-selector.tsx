"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages, Check, Globe } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function LanguageSelector() {
  const { locale, setLocale, availableLocales } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")

  if (!availableLocales || availableLocales.length === 0) {
    return null
  }

  // Group languages by region
  const groupedLanguages = availableLocales.reduce(
    (acc, lang) => {
      if (!acc[lang.region]) {
        acc[lang.region] = []
      }
      acc[lang.region].push(lang)
      return acc
    },
    {} as Record<string, typeof availableLocales>,
  )

  // Filter languages based on search
  const filteredLanguages = availableLocales.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 text-white w-80 max-h-96 overflow-y-auto">
        <div className="p-2">
          <Input
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <DropdownMenuSeparator className="bg-gray-700" />

        {searchTerm
          ? // Show filtered results
            filteredLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className="flex items-center justify-between hover:bg-gray-800 focus:bg-gray-800 px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-gray-400">
                    {lang.name} • {lang.region}
                  </span>
                </div>
                {locale === lang.code && <Check className="h-4 w-4 text-green-400" />}
              </DropdownMenuItem>
            ))
          : // Show grouped by region
            Object.entries(groupedLanguages).map(([region, languages]) => (
              <div key={region}>
                <DropdownMenuLabel className="text-gray-300 text-xs font-semibold px-3 py-1">
                  <Globe className="h-3 w-3 inline mr-1" />
                  {region}
                </DropdownMenuLabel>
                {languages.slice(0, 5).map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className="flex items-center justify-between hover:bg-gray-800 focus:bg-gray-800 px-3 py-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{lang.nativeName}</span>
                      <span className="text-xs text-gray-400">{lang.name}</span>
                    </div>
                    {locale === lang.code && <Check className="h-4 w-4 text-green-400" />}
                  </DropdownMenuItem>
                ))}
                {languages.length > 5 && (
                  <div className="px-3 py-1 text-xs text-gray-500">
                    +{languages.length - 5} more languages in {region}
                  </div>
                )}
                <DropdownMenuSeparator className="bg-gray-700" />
              </div>
            ))}

        <div className="p-2 text-xs text-gray-400 text-center border-t border-gray-700">
          {availableLocales.length} languages available • Global platform
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSelector
