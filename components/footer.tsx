"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n/i18n-context"
import { LocaleSwitcher } from "./locale-switcher"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-gray-800 bg-black py-6 md:py-10">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <Link href="/" className="font-bold text-white">
            Heavenslive
          </Link>
          <nav className="flex gap-4 md:gap-6 text-sm">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
              {t("footer.about")}
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              {t("footer.terms")}
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              {t("footer.contact")}
            </Link>
            <Link href="/bug-report" className="text-gray-400 hover:text-white transition-colors">
              {t("bugReport.reportBug")}
            </Link>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <LocaleSwitcher />
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Heavenslive. {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  )
}
