"use client"

import { useI18n } from "@/lib/i18n/i18n-context"
import { LanguageSettings } from "@/components/profile/language-settings"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useSimpleAuth } from "@/components/simple-auth-provider"

export default function ProfilePage() {
  const { t } = useI18n()
  const { user } = useSimpleAuth()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t("common.profile")}</h1>
            <p className="text-muted-foreground mt-2">{t("profile.description")}</p>
          </div>

          <Separator />

          <div className="grid gap-6">
            {/* Basic Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.basicInfo")}</CardTitle>
                <CardDescription>{t("profile.basicInfoDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("common.firstName")}</Label>
                    <Input id="firstName" defaultValue={user?.name?.split(" ")[0] || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("common.lastName")}</Label>
                    <Input id="lastName" defaultValue={user?.name?.split(" ")[1] || ""} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("common.email")}</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} />
                </div>
                <Button>{t("common.save")}</Button>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <LanguageSettings />

            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.appearance")}</CardTitle>
                <CardDescription>{t("settings.appearanceDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <a href="/settings/appearance">{t("settings.manageAppearance")}</a>
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.security")}</CardTitle>
                <CardDescription>{t("settings.securityDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline">{t("settings.changePassword")}</Button>
                <Button variant="outline">{t("settings.enable2FA")}</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
