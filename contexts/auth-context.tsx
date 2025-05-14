"use client"

import { createContext, useContext, type ReactNode } from "react"

type AuthContextType = {
  user: { name: string; role: string } | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: { name: "Demo User", role: "Admin" },
  isLoading: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Simplified auth provider with no localStorage or complex logic
  const user = { name: "Demo User", role: "Admin" }
  const isLoading = false

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}
