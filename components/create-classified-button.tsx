"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"

export function CreateClassifiedButton() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Button onClick={() => signIn()}>
        <Plus className="h-4 w-4 mr-2" />
        Sign In to Post
      </Button>
    )
  }

  return (
    <Button asChild>
      <Link href="/classifieds/create">
        <Plus className="h-4 w-4 mr-2" />
        Post Listing
      </Link>
    </Button>
  )
}
