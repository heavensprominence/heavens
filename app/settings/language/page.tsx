"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/lib/i18n/i18n-context"
import { useToast } from "@/hooks/use-toast"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
]

export default function LanguageSettingsPage() {
  const { locale, setLocale, t } = useI18n()
  const [selectedLocale, setSelectedLocale] = useState(locale)
  const { toast } = useToast()

  const handleSave = () => {
    setLocale(selectedLocale)
    toast({
      title: t("settings.languageChanged"),
      duration: 3000,
    })
  }

  return (
    <div className="container py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t("settings.language")}</CardTitle>
          <CardDescription>{t("settings.selectLanguage")}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedLocale}
            onValueChange={(value) => setSelectedLocale(value as any)}
            className="space-y-4"
          >
            {languages.map((language) => (
              <div key={language.code} className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value={language.code} id={language.code} />
                <Label htmlFor={language.code} className="flex-1">
                  {language.name}
                </Label>
                {selectedLocale === language.code && <Check className="h-4 w-4 text-primary" />}
              </div>
            ))}
          </RadioGroup>
          <Button onClick={handleSave} className="w-full mt-6">
            {t("settings.saveChanges")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
