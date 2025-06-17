"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { useLocaleSync } from "@/hooks/use-locale-sync"

function LocaleSync() {
  useLocaleSync()
  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleSync />
      {children}
    </SessionProvider>
  )
}
