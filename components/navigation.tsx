"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Globe, Menu, X, Wallet } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  const { user, logout, loading } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Heavenslive</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/currencies" className="text-foreground hover:text-primary transition-colors">
              CRED Currency
            </Link>
            <Link href="/classifieds" className="text-foreground hover:text-primary transition-colors">
              Classifieds
            </Link>
            <Link href="/auctions" className="text-foreground hover:text-primary transition-colors">
              Auctions
            </Link>
            <Link href="/trading" className="text-foreground hover:text-primary transition-colors">
              Trading
            </Link>
            {user && (
              <Link href="/wallet" className="text-foreground hover:text-primary transition-colors">
                Wallet
              </Link>
            )}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Globe className="h-4 w-4 mr-2" />
                  English
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>🇺🇸 English</DropdownMenuItem>
                <DropdownMenuItem>🇪🇸 Español</DropdownMenuItem>
                <DropdownMenuItem>🇫🇷 Français</DropdownMenuItem>
                <DropdownMenuItem>🇩🇪 Deutsch</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Auth Buttons */}
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <Wallet className="h-4 w-4" />
                  <span className="font-medium">{user.credBalance.toFixed(2)} CRED</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {user.name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/wallet">Wallet</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signin">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/currencies" className="text-foreground hover:text-primary transition-colors">
                CRED Currency
              </Link>
              <Link href="/classifieds" className="text-foreground hover:text-primary transition-colors">
                Classifieds
              </Link>
              <Link href="/auctions" className="text-foreground hover:text-primary transition-colors">
                Auctions
              </Link>
              <Link href="/trading" className="text-foreground hover:text-primary transition-colors">
                Trading
              </Link>
              {user && (
                <Link href="/wallet" className="text-foreground hover:text-primary transition-colors">
                  Wallet
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
