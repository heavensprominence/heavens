"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, TrendingUp, Shield } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-6">
              <Globe className="w-4 h-4 mr-2" />
              {t("home.supporting")}
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6">{t("home.welcome")}</h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("home.subtitle")}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/auth/signup">
                {t("home.getStarted")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="/currencies">{t("home.exploreCurrencies")}</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg mx-auto mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold mb-2">180+</div>
              <div className="text-muted-foreground">{t("home.globalCurrencies")}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg mx-auto mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold mb-2">{t("home.credAmount")}</div>
              <div className="text-muted-foreground">{t("home.registrationBonus")}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-muted-foreground">{t("home.secureTransactions")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
