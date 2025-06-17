import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SimpleAuthProvider } from "@/components/simple-auth-provider"
import { I18nProvider } from "@/lib/i18n/i18n-provider"
import { Header } from "@/components/header"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Heavenslive - Global Financial Platform",
  description:
    "The world's most transparent financial platform with CRED cryptocurrency, global marketplace, and financial services.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white`}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <I18nProvider>
              <SimpleAuthProvider>
                <div className="min-h-screen bg-black">
                  <DemoModeBanner />
                  <Header />
                  <main>{children}</main>
                </div>
              </SimpleAuthProvider>
            </I18nProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
