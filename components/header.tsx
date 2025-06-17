"use client"

import Link from "next/link"
import { useSimpleAuth } from "@/components/simple-auth-provider"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Coins, ShoppingBag, Gavel, HandHeart, TrendingUp, MessageSquare, Menu, X } from "lucide-react"
import { useState } from "react"
import { useI18n } from "@/lib/i18n/i18n-context"

export function Header() {
  const { user, logout } = useSimpleAuth()
  const { t } = useI18n()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: "/marketplace", icon: ShoppingBag, label: t("nav.marketplace") },
    { href: "/currencies", icon: Coins, label: t("nav.currencies") },
    { href: "/auctions", icon: Gavel, label: t("nav.auctions") },
    { href: "/financial", icon: HandHeart, label: t("nav.grants") },
    { href: "/trading", icon: TrendingUp, label: t("nav.trading") },
    { href: "/messages", icon: MessageSquare, label: t("nav.communication") },
  ]

  return (
    <header className="border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <Coins className="h-6 w-6 text-white" />
          <span className="text-xl font-bold text-white">Heavenslive</span>
        </Link>

        {/* Desktop Navigation - Shows on laptop and larger */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          {/* Theme and Language - Always visible */}
          <ThemeToggle />
          <LanguageSelector />

          {/* User section */}
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                  {user.role}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-white hover:bg-gray-800"
                onClick={logout}
              >
                <span className="hidden sm:inline">{t("nav.signOut")}</span>
                <span className="sm:hidden">{t("nav.signOut")}</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800" asChild>
                <Link href="/auth/signin">
                  <span className="hidden sm:inline">{t("nav.signIn")}</span>
                  <span className="sm:hidden">{t("nav.signIn")}</span>
                </Link>
              </Button>
              <Button size="sm" className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href="/auth/signup">
                  <span className="hidden sm:inline">{t("nav.signUp")}</span>
                  <span className="sm:hidden">{t("nav.signUp")}</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button - Hidden on laptop and larger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-gray-800">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-gray-900 border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <Coins className="h-6 w-6 text-white" />
                  <span className="text-xl font-bold text-white">Heavenslive</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-3 rounded-md hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-lg">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile User Info */}
              {user && (
                <div className="mt-8 p-4 bg-gray-800 rounded-md">
                  <p className="text-white font-medium">{user.name}</p>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300 mt-1">
                    {user.role}
                  </Badge>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
