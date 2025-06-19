import Link from "next/link"
import { Globe, Shield, Book } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-gray-700 to-gray-900 border border-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-gray-300 font-bold text-sm">₡</span>
              </div>
              <span className="font-bold text-xl">Heavenslive</span>
            </div>
            <p className="text-gray-400">{t("footer.description")}</p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t("footer.platform")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/currencies" className="hover:text-white transition-colors">
                  {t("nav.currencies")}
                </Link>
              </li>
              <li>
                <Link href="/classifieds" className="hover:text-white transition-colors">
                  {t("nav.classifieds")}
                </Link>
              </li>
              <li>
                <Link href="/auctions" className="hover:text-white transition-colors">
                  {t("nav.auctions")}
                </Link>
              </li>
              <li>
                <Link href="/wallet" className="hover:text-white transition-colors">
                  {t("nav.wallet")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t("footer.support")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  {t("footer.help")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  {t("footer.security")}
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-white transition-colors">
                  {t("footer.api")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t("footer.legal")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-white transition-colors">
                  {t("footer.compliance")}
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="hover:text-white transition-colors">
                  {t("footer.licenses")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">{t("footer.copyright")}</div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <span>{t("footer.currencies")}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>{t("footer.security")}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Book className="w-4 h-4" />
                <span>{t("footer.ledger")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
