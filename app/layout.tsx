import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SimpleAuthProvider } from "@/components/simple-auth-provider"
import { Header } from "@/components/header"
import { DemoModeBanner } from "@/components/demo-mode-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Heavenslive - Transparent Financial Platform",
  description: "A fully transparent platform for CRED cryptocurrency, marketplace, grants, and loans",
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
            <div className="min-h-screen flex flex-col">
              <Header />
              <DemoModeBanner />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </SimpleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
