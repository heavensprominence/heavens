"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"

export function CreateAuctionButton() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Button asChild>
        <Link href="/auth/signin">
          <Plus className="h-4 w-4 mr-2" />
          Sign In to Create
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild>
      <Link href="/auctions/create">
        <Plus className="h-4 w-4 mr-2" />
        Create Auction
      </Link>
    </Button>
  )
}
