// Simple authentication utilities without NextAuth complexity
export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthSession {
  user: User | null
  isAuthenticated: boolean
}

// Simple session management using localStorage (for demo purposes)
export const authUtils = {
  setSession: (user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_session", JSON.stringify(user))
    }
  },

  getSession: (): User | null => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("auth_session")
      return session ? JSON.parse(session) : null
    }
    return null
  },

  clearSession: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_session")
    }
  },

  isAuthenticated: (): boolean => {
    return authUtils.getSession() !== null
  },
}
