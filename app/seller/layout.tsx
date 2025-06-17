"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useSimpleAuth } from "@/components/simple-auth-provider"
import { Loader2 } from "lucide-react"

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useSimpleAuth()
  const router = useRouter()
  const [isSellerVerified, setIsSellerVerified] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin?redirect=/seller")
      return
    }

    if (user) {
      // Check if user is verified seller
      checkSellerStatus()
    }
  }, [user, loading, router])

  const checkSellerStatus = async () => {
    try {
      const response = await fetch("/api/seller/status")
      const data = await response.json()
      setIsSellerVerified(data.isVerified)
    } catch (error) {
      console.error("Error checking seller status:", error)
    } finally {
      setCheckingStatus(false)
    }
  }

  if (loading || checkingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!isSellerVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Seller Verification Required</h1>
          <p className="text-muted-foreground mb-4">
            You need to complete seller verification to access the seller dashboard.
          </p>
          <button
            onClick={() => router.push("/seller/onboarding")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Start Verification
          </button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <SellerSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
