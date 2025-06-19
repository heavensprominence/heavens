"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { useI18n } from "@/lib/i18n/i18n-context"
import { useEffect, useState } from "react"

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("settings.appearance")}</h1>
        <p className="text-muted-foreground">{t("settings.appearanceDescription")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.theme")}</CardTitle>
          <CardDescription>{t("settings.themeDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">{t("theme.light")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">{t("theme.dark")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">{t("theme.system")}</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.preview")}</CardTitle>
          <CardDescription>{t("settings.previewDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">Sample Card</h3>
              <p className="text-sm text-muted-foreground">This is how cards will look in your selected theme.</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-semibold">Muted Background</h3>
              <p className="text-sm text-muted-foreground">This shows muted backgrounds and text.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
