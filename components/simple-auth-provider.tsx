"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("heavenslive_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.log("No saved user found")
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Demo accounts that always work
      if (email === "admin@demo.com" && password === "demo123") {
        const demoUser = {
          id: "admin-demo",
          email: "admin@demo.com",
          name: "Admin Demo",
          role: "admin",
        }
        setUser(demoUser)
        localStorage.setItem("heavenslive_user", JSON.stringify(demoUser))
        return true
      }

      if (email === "user@demo.com" && password === "demo123") {
        const demoUser = {
          id: "user-demo",
          email: "user@demo.com",
          name: "User Demo",
          role: "user",
        }
        setUser(demoUser)
        localStorage.setItem("heavenslive_user", JSON.stringify(demoUser))
        return true
      }

      // For any other email/password, create a demo account
      const newUser = {
        id: `user-${Date.now()}`,
        email: email,
        name: email.split("@")[0],
        role: "user",
      }
      setUser(newUser)
      localStorage.setItem("heavenslive_user", JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    try {
      const newUser = {
        id: `user-${Date.now()}`,
        email: email,
        name: `${firstName} ${lastName}`,
        role: "user",
      }
      setUser(newUser)
      localStorage.setItem("heavenslive_user", JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = () => {
    try {
      setUser(null)
      localStorage.removeItem("heavenslive_user")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useSimpleAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useSimpleAuth must be used within a SimpleAuthProvider")
  }
  return context
}
