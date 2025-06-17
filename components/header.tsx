"use client"

import Link from "next/link"
import { useSimpleAuth } from "@/components/simple-auth-provider"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { Badge } from "@/components/ui/badge"
import { Coins, ShoppingBag, Gavel, HandHeart, TrendingUp, MessageSquare } from "lucide-react"

export function Header() {
  const { user, logout } = useSimpleAuth()

  return (
    <header className="border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">Heavenslive</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/marketplace"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Marketplace</span>
            </Link>
            <Link
              href="/auctions"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Gavel className="h-4 w-4" />
              <span>Auctions</span>
            </Link>
            <Link
              href="/financial"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <HandHeart className="h-4 w-4" />
              <span>Grants & Loans</span>
            </Link>
            <Link
              href="/trading"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Trading</span>
            </Link>
            <Link
              href="/messages"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Communication</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LanguageSelector />

          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block">
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
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
