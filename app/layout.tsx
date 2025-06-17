import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n/i18n-provider"
import { SimpleAuthProvider } from "@/components/simple-auth-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Header } from "@/components/header"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Heavenslive - Global Financial Platform",
  description: "The world's most transparent financial platform supporting 195+ countries",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <I18nProvider>
              <SimpleAuthProvider>
                <div className="min-h-screen bg-background">
                  <DemoModeBanner />
                  <Header />
                  <main>{children}</main>
                </div>
                <Toaster />
              </SimpleAuthProvider>
            </I18nProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
