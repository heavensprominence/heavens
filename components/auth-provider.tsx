"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
  credBalance: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  updateCredBalance: (newBalance: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
      // Demo accounts
      if (email === "admin@heavenslive.com" && password === "admin123") {
        const adminUser = {
          id: "admin-demo",
          email: "admin@heavenslive.com",
          name: "Admin Demo",
          role: "admin",
          credBalance: 10000,
        }
        setUser(adminUser)
        localStorage.setItem("heavenslive_user", JSON.stringify(adminUser))
        return true
      }

      if (email === "user@demo.com" && password === "demo123") {
        const demoUser = {
          id: "user-demo",
          email: "user@demo.com",
          name: "Demo User",
          role: "user",
          credBalance: 100, // Registration bonus
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
        credBalance: 100, // Registration bonus
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
        credBalance: 100, // Registration bonus
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

  const updateCredBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, credBalance: newBalance }
      setUser(updatedUser)
      localStorage.setItem("heavenslive_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateCredBalance }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
