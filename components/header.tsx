"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SimpleAuthStatus } from "@/components/simple-auth-status"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { useI18n } from "@/lib/i18n/i18n-context"
import { MobileMenu } from "./mobile-menu"

export function Header() {
  const pathname = usePathname()
  const { t } = useI18n()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <MobileMenu />
          <Link href="/" className="font-bold text-xl">
            Heavenslive
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/marketplace"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/marketplace") ? "text-primary" : "text-muted-foreground"}`}
            >
              {t("common.marketplace")}
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/dashboard") ? "text-primary" : "text-muted-foreground"}`}
            >
              {t("common.dashboard")}
            </Link>
            <Link
              href="/community"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/community") ? "text-primary" : "text-muted-foreground"}`}
            >
              {t("common.community")}
            </Link>
            <Link
              href="/support"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/support") ? "text-primary" : "text-muted-foreground"}`}
            >
              {t("common.support")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector />
          <SimpleAuthStatus />
        </div>
      </div>
    </header>
  )
}
