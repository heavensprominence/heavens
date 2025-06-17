"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bug, Send, CheckCircle } from "lucide-react"
import { useSimpleAuth } from "@/components/simple-auth-provider"
import { useI18n } from "@/lib/i18n/i18n-context"

interface BugReportFormProps {
  onSubmit?: () => void
}

export function BugReportForm({ onSubmit }: BugReportFormProps) {
  const { user } = useSimpleAuth()
  const { t } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium",
    category: "general",
    user_email: user?.email || "",
    page_url: typeof window !== "undefined" ? window.location.href : "",
    steps_to_reproduce: "",
    expected_behavior: "",
    actual_behavior: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bug-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user_id: user?.id || null,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        onSubmit?.()
      } else {
        throw new Error("Failed to submit bug report")
      }
    } catch (error) {
      console.error("Error submitting bug report:", error)
      alert("Failed to submit bug report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gray-900 border-gray-700">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t("bugReport.submitted")}</h3>
          <p className="text-gray-300">{t("bugReport.thankYou")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Bug className="h-5 w-5" />
          <span>{t("bugReport.title")}</span>
        </CardTitle>
        <CardDescription className="text-gray-300">{t("bugReport.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="severity" className="text-white">
                {t("bugReport.severity")}
              </Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="low">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {t("bugReport.severityLow")}
                    </Badge>
                  </SelectItem>
                  <SelectItem value="medium">
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      {t("bugReport.severityMedium")}
                    </Badge>
                  </SelectItem>
                  <SelectItem value="high">
                    <Badge variant="outline" className="text-orange-400 border-orange-400">
                      {t("bugReport.severityHigh")}
                    </Badge>
                  </SelectItem>
                  <SelectItem value="critical">
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      {t("bugReport.severityCritical")}
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category" className="text-white">
                {t("bugReport.category")}
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="ui">{t("bugReport.categoryUI")}</SelectItem>
                  <SelectItem value="functionality">{t("bugReport.categoryFunctionality")}</SelectItem>
                  <SelectItem value="performance">{t("bugReport.categoryPerformance")}</SelectItem>
                  <SelectItem value="security">{t("bugReport.categorySecurity")}</SelectItem>
                  <SelectItem value="translation">{t("bugReport.categoryTranslation")}</SelectItem>
                  <SelectItem value="mobile">{t("bugReport.categoryMobile")}</SelectItem>
                  <SelectItem value="general">{t("bugReport.categoryGeneral")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title" className="text-white">
              {t("bugReport.bugTitle")} *
            </Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder={t("bugReport.titlePlaceholder")}
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">
              {t("bugReport.bugDescription")} *
            </Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
              placeholder={t("bugReport.descriptionPlaceholder")}
            />
          </div>

          <div>
            <Label htmlFor="steps" className="text-white">
              {t("bugReport.stepsToReproduce")}
            </Label>
            <Textarea
              id="steps"
              value={formData.steps_to_reproduce}
              onChange={(e) => setFormData({ ...formData, steps_to_reproduce: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
              placeholder={t("bugReport.stepsPlaceholder")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expected" className="text-white">
                {t("bugReport.expectedBehavior")}
              </Label>
              <Textarea
                id="expected"
                value={formData.expected_behavior}
                onChange={(e) => setFormData({ ...formData, expected_behavior: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                placeholder={t("bugReport.expectedPlaceholder")}
              />
            </div>

            <div>
              <Label htmlFor="actual" className="text-white">
                {t("bugReport.actualBehavior")}
              </Label>
              <Textarea
                id="actual"
                value={formData.actual_behavior}
                onChange={(e) => setFormData({ ...formData, actual_behavior: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                placeholder={t("bugReport.actualPlaceholder")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-white">
              {t("bugReport.contactEmail")}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder={t("bugReport.emailPlaceholder")}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-gray-200">
            {isSubmitting ? (
              <span>{t("bugReport.submitting")}</span>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t("bugReport.submit")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
