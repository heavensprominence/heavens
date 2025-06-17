"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n/i18n-context"
import { LocaleSwitcher } from "./locale-switcher"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <Link href="/" className="font-bold">
            Heavenslive
          </Link>
          <nav className="flex gap-4 md:gap-6 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <LocaleSwitcher />
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Heavenslive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
