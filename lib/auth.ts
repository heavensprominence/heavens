// Simple custom authentication system
export interface User {
  id: string
  email: string
  name: string
  role: string
  joinNumber: number
  credBalance: number
}

export const DEMO_USER: User = {
  id: "demo-user-1",
  email: "demo@heavenslive.com",
  name: "Demo User",
  role: "user",
  joinNumber: 1,
  credBalance: 15000,
}

export function validateCredentials(email: string, password: string): User | null {
  if (email === "demo@heavenslive.com" && password === "demo123") {
    return DEMO_USER
  }
  return null
}
