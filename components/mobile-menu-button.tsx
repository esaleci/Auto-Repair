"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function MobileMenuButton() {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)

    // Get the sidebar element
    const sidebar = document.querySelector('[data-sidebar="true"]')

    if (sidebar) {
      if (isOpen) {
        sidebar.classList.add("translate-x-[-250px]")
        sidebar.classList.remove("translate-x-0")
      } else {
        sidebar.classList.remove("translate-x-[-250px]")
        sidebar.classList.add("translate-x-0")
      }
    }
  }

  if (!isMobile) return null

  return (
    <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
      <Menu className="h-5 w-5" />
    </Button>
  )
}
