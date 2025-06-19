export interface User {
  id: string
  email: string
  name?: string
  role: "user" | "admin" | "super_admin" | "owner"
  joinNumber: number
  credBalance: number
  createdAt: Date
  updatedAt: Date
}

export interface Currency {
  code: string
  name: string
  emoji: string
  exchangeRate: number
}

export interface Transaction {
  id: string
  type:
    | "minting"
    | "burning"
    | "transfer"
    | "registration_bonus"
    | "grant"
    | "loan_interest_free"
    | "loan_interest_bearing"
    | "trading"
    | "auction_payment"
    | "classified_payment"
    | "refund"
  amount: number
  currency: string
  fromUserId?: string
  toUserId?: string
  description: string
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
  createdAt: Date
}

export interface ClassifiedListing {
  id: string
  userId: string
  title: string
  description: string
  price: number
  currency: string
  type: "for_sale" | "wanted"
  images: string[]
  location: string
  status: "active" | "sold" | "expired"
  rating?: number
  createdAt: Date
  expiresAt: Date
}

export interface Auction {
  id: string
  userId: string
  title: string
  description: string
  type: "forward" | "reverse"
  startingPrice: number
  reservePrice?: number
  buyNowPrice?: number
  currency: string
  duration: number
  images: string[]
  location: string
  status: "active" | "ended" | "cancelled"
  bidsVisible: boolean
  createdAt: Date
  endsAt: Date
}

export interface Bid {
  id: string
  auctionId: string
  userId: string
  amount: number
  milestones?: string
  details?: string
  createdAt: Date
}
