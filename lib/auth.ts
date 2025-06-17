import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      image?: string
    }
  }

  interface User {
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    role: string
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check if database is available
          if (!process.env.DATABASE_URL) {
            console.error("DATABASE_URL not configured")
            return null
          }

          const user = await sql`
            SELECT id, email, password_hash, first_name, last_name, role, status
            FROM users 
            WHERE email = ${credentials.email} AND status = 'active'
          `

          if (user.length === 0) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user[0].password_hash)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user[0].id.toString(),
            email: user[0].email,
            name: `${user[0].first_name} ${user[0].last_name}`,
            role: user[0].role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  // Remove debug mode to avoid crypto issues
  debug: false,
}
