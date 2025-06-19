"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminLanguageSettings() {
  const { availableLocales, t, locale } = useI18n()
  const [defaultLocale, setDefaultLocale] = useState("en")
  const [enabledLocales, setEnabledLocales] = useState<string[]>(["en", "es", "fr", "ar", "zh"])
  const [autoDetect, setAutoDetect] = useState(true)
  const [loading, setLoading] = useState(false)

  // In a real app, this would fetch from your API
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setDefaultLocale("en")
      setEnabledLocales(["en", "es", "fr", "ar", "zh"])
      setAutoDetect(true)
    }, 500)
  }, [])

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // In a real app, this would save to your API
      console.log("Saving language settings:", {
        defaultLocale,
        enabledLocales,
        autoDetect,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      alert("Language settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!availableLocales) {
    return (
      <div className="container py-10">
        <div className="text-center">Loading language settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Language Settings</h1>
        <p className="text-muted-foreground">Configure language and localization settings for your platform</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="locales">Available Locales</TabsTrigger>
          <TabsTrigger value="translations">Custom Translations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Language Settings</CardTitle>
              <CardDescription>Configure the default language and detection settings for your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultLocale">Default Language</Label>
                <Select value={defaultLocale} onValueChange={setDefaultLocale}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocales.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.name} ({l.nativeName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoDetect"
                  checked={autoDetect}
                  onCheckedChange={(checked) => setAutoDetect(checked === true)}
                />
                <Label htmlFor="autoDetect">Automatically detect user's language</Label>
              </div>

              <Button onClick={handleSaveSettings} disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locales">
          <Card>
            <CardHeader>
              <CardTitle>Available Locales</CardTitle>
              <CardDescription>Enable or disable languages for your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableLocales.map((l) => (
                  <div key={l.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`locale-${l.code}`}
                      checked={enabledLocales.includes(l.code)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEnabledLocales([...enabledLocales, l.code])
                        } else {
                          setEnabledLocales(enabledLocales.filter((code) => code !== l.code))
                        }
                      }}
                    />
                    <Label htmlFor={`locale-${l.code}`} className="flex items-center gap-2">
                      <span>{l.name}</span>
                      <span className="text-sm text-muted-foreground">({l.nativeName})</span>
                      {l.rtl && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">RTL</span>}
                    </Label>
                  </div>
                ))}

                <Button onClick={handleSaveSettings} disabled={loading} className="mt-4">
                  {loading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translations">
          <Card>
            <CardHeader>
              <CardTitle>Custom Translations</CardTitle>
              <CardDescription>Add or modify translations for your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="translationKey">Translation Key</Label>
                    <Input id="translationKey" placeholder="common.welcome" />
                  </div>
                  <div>
                    <Label htmlFor="translationLocale">Language</Label>
                    <Select>
                      <SelectTrigger>
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
                </div>

                <div>
                  <Label htmlFor="translationValue">Translation Value</Label>
                  <Input id="translationValue" placeholder="Welcome to Heavenslive" />
                </div>

                <Button>Add Translation</Button>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Current Custom Translations</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left">Key</th>
                          <th className="p-2 text-left">Language</th>
                          <th className="p-2 text-left">Value</th>
                          <th className="p-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2">common.welcome</td>
                          <td className="p-2">English</td>
                          <td className="p-2">Welcome to our platform</td>
                          <td className="p-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              Delete
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
