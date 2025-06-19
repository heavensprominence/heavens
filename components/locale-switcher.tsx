"use client"

import { useI18n } from "@/lib/i18n/i18n-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LocaleSwitcher() {
  const { locale, setLocale, availableLocales } = useI18n()

  return (
    <div className="flex items-center space-x-2">
      <Select value={locale} onValueChange={setLocale}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {availableLocales.map((l) => (
            <SelectItem key={l.code} value={l.code}>
              {l.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
