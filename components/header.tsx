import { Coins, ShoppingBag, Gavel, HandHeart, MessageSquare, HelpCircle, Users } from "lucide-react"

const navigation = [
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "Auctions", href: "/auctions", icon: Gavel },
  { name: "Grants & Loans", href: "/financial", icon: HandHeart },
  { name: "Trading", href: "/trading", icon: Coins },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Support", href: "/support", icon: HelpCircle },
  { name: "Community", href: "/community", icon: Users },
]

export function Header() {
  // ... existing component code stays the same ...
}
