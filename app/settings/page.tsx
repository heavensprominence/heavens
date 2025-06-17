"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/lib/i18n/i18n-context"
import { useSimpleAuth } from "@/components/simple-auth-provider"

export default function SettingsPage() {
  const { t } = useI18n()
  const { user } = useSimpleAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("common.settings")}</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile information and email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user?.name || ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email || ""} />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
          <CardDescription>Access commonly used settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("settings.language")}</p>
              <p className="text-sm text-muted-foreground">{t("settings.languageDescription")}</p>
            </div>
            <Button variant="outline" asChild>
              <a href="/settings/language">Configure</a>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("settings.appearance")}</p>
              <p className="text-sm text-muted-foreground">{t("settings.appearanceDescription")}</p>
            </div>
            <Button variant="outline" asChild>
              <a href="/settings/appearance">Configure</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
