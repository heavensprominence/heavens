export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  joinNumber: number
  registrationBonus: number
  walletBalance: number
  createdAt: Date
  updatedAt: Date
}

export interface Currency {
  id: string
  name: string
  code: string
  symbol: string
  country: string
  flag: string
  credValue: number
  isActive: boolean
}

export interface Transaction {
  id: string
  fromUserId: string
  toUserId: string
  amount: number
  currency: string
  type: "send" | "receive" | "bonus" | "purchase" | "sale"
  description: string
  status: "pending" | "completed" | "failed"
  createdAt: Date
}

export interface Classified {
  id: string
  userId: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  location: string
  images: string[]
  status: "active" | "sold" | "expired"
  createdAt: Date
  updatedAt: Date
}

export interface Auction {
  id: string
  userId: string
  title: string
  description: string
  startingPrice: number
  currentPrice: number
  reservePrice?: number
  buyNowPrice?: number
  currency: string
  category: string
  location: string
  images: string[]
  type: "forward" | "reverse"
  status: "active" | "ended" | "cancelled"
  endTime: Date
  bidCount: number
  highestBidderId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Bid {
  id: string
  auctionId: string
  userId: string
  amount: number
  createdAt: Date
}
