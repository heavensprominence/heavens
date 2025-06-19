"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  credBalance: number
  joinedAt: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string, bonus: number) => Promise<boolean>
  signOut: () => void
  updateCredBalance: (newBalance: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("heavenslive_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Check if user exists
    const users = JSON.parse(localStorage.getItem("heavenslive_users") || "[]")
    const existingUser = users.find((u: any) => u.email === email && u.password === password)

    if (existingUser) {
      const userSession = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        credBalance: existingUser.credBalance,
        joinedAt: existingUser.joinedAt,
        role: existingUser.role,
      }
      setUser(userSession)
      localStorage.setItem("heavenslive_user", JSON.stringify(userSession))
      return true
    }
    return false
  }

  const signUp = async (email: string, password: string, name: string, bonus: number): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("heavenslive_users") || "[]")

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      credBalance: bonus,
      joinedAt: new Date().toISOString(),
      role: "user" as const,
    }

    users.push(newUser)
    localStorage.setItem("heavenslive_users", JSON.stringify(users))

    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      credBalance: newUser.credBalance,
      joinedAt: newUser.joinedAt,
      role: newUser.role,
    }
    setUser(userSession)
    localStorage.setItem("heavenslive_user", JSON.stringify(userSession))

    // Add registration bonus transaction to public ledger
    const publicLedger = JSON.parse(localStorage.getItem("public_ledger") || "[]")
    publicLedger.unshift({
      id: Date.now().toString(),
      from: "HeavensLive System",
      to: name,
      amount: bonus,
      timestamp: new Date().toISOString(),
      type: "bonus",
    })
    localStorage.setItem("public_ledger", JSON.stringify(publicLedger.slice(0, 100)))

    return true
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("heavenslive_user")
  }

  const updateCredBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, credBalance: newBalance }
      setUser(updatedUser)
      localStorage.setItem("heavenslive_user", JSON.stringify(updatedUser))

      // Update in users array
      const users = JSON.parse(localStorage.getItem("heavenslive_users") || "[]")
      const updatedUsers = users.map((u: any) => (u.id === user.id ? { ...u, credBalance: newBalance } : u))
      localStorage.setItem("heavenslive_users", JSON.stringify(updatedUsers))
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, updateCredBalance }}>{children}</AuthContext.Provider>
  )
}
