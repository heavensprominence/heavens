"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useI18n } from "@/lib/i18n/i18n-context"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Heavenslive</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <Link href="/marketplace" className="px-2 py-1 text-lg" onClick={() => setOpen(false)}>
            {t("common.marketplace")}
          </Link>
          <Link href="/dashboard" className="px-2 py-1 text-lg" onClick={() => setOpen(false)}>
            {t("common.dashboard")}
          </Link>
          <Link href="/community" className="px-2 py-1 text-lg" onClick={() => setOpen(false)}>
            {t("common.community")}
          </Link>
          <Link href="/support" className="px-2 py-1 text-lg" onClick={() => setOpen(false)}>
            {t("common.support")}
          </Link>

          <div className="border-t pt-4 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("common.theme")}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("common.language")}</span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
