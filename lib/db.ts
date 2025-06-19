import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

export async function getUser(email: string) {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `
    return users[0] || null
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  name: string
  joinNumber: number
}) {
  try {
    const users = await sql`
      INSERT INTO users (email, name, join_number, registration_bonus, wallet_balance, role)
      VALUES (${userData.email}, ${userData.name}, ${userData.joinNumber}, 100, 100, 'user')
      RETURNING *
    `
    return users[0]
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export async function getNextJoinNumber() {
  try {
    const result = await sql`
      SELECT COALESCE(MAX(join_number), 0) + 1 as next_number FROM users
    `
    return result[0]?.next_number || 1
  } catch (error) {
    console.error("Database error:", error)
    return Math.floor(Math.random() * 1000000) + 1
  }
}

export async function getUserTransactions(userId: string) {
  try {
    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE from_user_id = ${userId} OR to_user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 50
    `
    return transactions
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

export async function createTransaction(transactionData: {
  fromUserId: string
  toUserId: string
  amount: number
  currency: string
  type: string
  description: string
}) {
  try {
    const transactions = await sql`
      INSERT INTO transactions (from_user_id, to_user_id, amount, currency, type, description, status)
      VALUES (${transactionData.fromUserId}, ${transactionData.toUserId}, ${transactionData.amount}, 
              ${transactionData.currency}, ${transactionData.type}, ${transactionData.description}, 'completed')
      RETURNING *
    `
    return transactions[0]
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export async function getPublicLedger(limit = 100) {
  try {
    const transactions = await sql`
      SELECT 
        t.*,
        u1.name as from_user_name,
        u2.name as to_user_name
      FROM transactions t
      LEFT JOIN users u1 ON t.from_user_id = u1.id
      LEFT JOIN users u2 ON t.to_user_id = u2.id
      ORDER BY t.created_at DESC
      LIMIT ${limit}
    `
    return transactions
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

export async function getClassifieds(filters?: {
  category?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}) {
  try {
    let query = `SELECT * FROM classifieds WHERE status = 'active'`
    const params: any[] = []

    if (filters?.category) {
      query += ` AND category = $${params.length + 1}`
      params.push(filters.category)
    }

    if (filters?.location) {
      query += ` AND location ILIKE $${params.length + 1}`
      params.push(`%${filters.location}%`)
    }

    if (filters?.minPrice) {
      query += ` AND price >= $${params.length + 1}`
      params.push(filters.minPrice)
    }

    if (filters?.maxPrice) {
      query += ` AND price <= $${params.length + 1}`
      params.push(filters.maxPrice)
    }

    if (filters?.search) {
      query += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 2})`
      params.push(`%${filters.search}%`, `%${filters.search}%`)
    }

    query += ` ORDER BY created_at DESC LIMIT 50`

    const classifieds = await sql(query, params)
    return classifieds
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

export async function createClassified(classifiedData: {
  userId: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  location: string
  images: string[]
}) {
  try {
    const classifieds = await sql`
      INSERT INTO classifieds (user_id, title, description, price, currency, category, location, images, status)
      VALUES (${classifiedData.userId}, ${classifiedData.title}, ${classifiedData.description}, 
              ${classifiedData.price}, ${classifiedData.currency}, ${classifiedData.category}, 
              ${classifiedData.location}, ${JSON.stringify(classifiedData.images)}, 'active')
      RETURNING *
    `
    return classifieds[0]
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export async function getAuctions(filters?: {
  type?: "forward" | "reverse"
  category?: string
  location?: string
  status?: string
  search?: string
}) {
  try {
    let query = `SELECT * FROM auctions WHERE status = 'active' AND end_time > NOW()`
    const params: any[] = []

    if (filters?.type) {
      query += ` AND type = $${params.length + 1}`
      params.push(filters.type)
    }

    if (filters?.category) {
      query += ` AND category = $${params.length + 1}`
      params.push(filters.category)
    }

    if (filters?.location) {
      query += ` AND location ILIKE $${params.length + 1}`
      params.push(`%${filters.location}%`)
    }

    if (filters?.search) {
      query += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 2})`
      params.push(`%${filters.search}%`, `%${filters.search}%`)
    }

    query += ` ORDER BY created_at DESC LIMIT 50`

    const auctions = await sql(query, params)
    return auctions
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

export async function createAuction(auctionData: {
  userId: string
  title: string
  description: string
  startingPrice: number
  reservePrice?: number
  buyNowPrice?: number
  currency: string
  category: string
  location: string
  images: string[]
  type: "forward" | "reverse"
  endTime: Date
}) {
  try {
    const auctions = await sql`
      INSERT INTO auctions (user_id, title, description, starting_price, current_price, reserve_price, 
                           buy_now_price, currency, category, location, images, type, status, end_time, bid_count)
      VALUES (${auctionData.userId}, ${auctionData.title}, ${auctionData.description}, 
              ${auctionData.startingPrice}, ${auctionData.startingPrice}, ${auctionData.reservePrice}, 
              ${auctionData.buyNowPrice}, ${auctionData.currency}, ${auctionData.category}, 
              ${auctionData.location}, ${JSON.stringify(auctionData.images)}, ${auctionData.type}, 
              'active', ${auctionData.endTime.toISOString()}, 0)
      RETURNING *
    `
    return auctions[0]
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}
