"use client"

import { useI18n } from "@/lib/i18n/i18n-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function LanguageSettings() {
  const { locale, setLocale, availableLocales, t } = useI18n()

  // Safety check to prevent the error
  if (!availableLocales || !Array.isArray(availableLocales)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Language Settings</CardTitle>
          <CardDescription>Loading language options...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.language")}</CardTitle>
        <CardDescription>{t("settings.languageDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={locale} onValueChange={setLocale} className="space-y-4">
          {availableLocales.map((l) => (
            <div key={l.code} className="flex items-center space-x-2">
              <RadioGroupItem value={l.code} id={`profile-lang-${l.code}`} />
              <Label htmlFor={`profile-lang-${l.code}`} className="flex items-center gap-2">
                <span>{l.name}</span>
                <span className="text-sm text-muted-foreground">({l.nativeName})</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
