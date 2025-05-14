"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isLoading, user } = useAuth()
  const pathname = usePathname()

  if (isLoading) {
    return null
  }

  return <>{children}</>
}
