declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role: string
      joinNumber: number
      credBalance: number
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    role?: string
    joinNumber?: number
    credBalance?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    joinNumber: number
    credBalance: number
  }
}
