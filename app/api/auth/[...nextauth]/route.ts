import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simple demo authentication
        if (credentials?.email === "demo@heavenslive.com" && credentials?.password === "demo123") {
          return {
            id: "demo-user",
            email: "demo@heavenslive.com",
            name: "Demo User",
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = "user"
        token.joinNumber = 1
        token.credBalance = 15000
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.joinNumber = token.joinNumber as number
        session.user.credBalance = token.credBalance as number
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
