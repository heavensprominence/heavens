import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SimpleAuthProvider } from "@/components/simple-auth-provider"
import { I18nProvider } from "@/lib/i18n/i18n-provider"
import { Header } from "@/components/header"
import { DemoModeBanner } from "@/components/demo-mode-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Heavenslive - Global Financial Platform",
  description:
    "A fully transparent platform for CRED cryptocurrency, global marketplace, grants, loans, and financial services supporting 195+ countries",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SimpleAuthProvider>
            <I18nProvider>
              <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <DemoModeBanner />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </I18nProvider>
          </SimpleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
