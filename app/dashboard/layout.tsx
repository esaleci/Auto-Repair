"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Car,
  ClipboardList,
  FileText,
  Home,
  Package,
  Settings,
  Store,
  Users,
  Wrench,
  Calendar,
  BarChart4,
  LogOut,
  User,
  Menu,
  Sparkles,
} from "lucide-react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import DashboardNav from "@/components/dashboard-nav"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/dashboard/customers",
    color: "text-violet-500",
  },
  {
    label: "Vehicles",
    icon: Car,
    href: "/dashboard/vehicles",
    color: "text-pink-700",
  },
  {
    label: "Repair Orders",
    icon: Wrench,
    href: "/dashboard/repair-orders",
    color: "text-orange-500",
  },
  {
    label: "Appointments",
    icon: Calendar,
    href: "/dashboard/appointments",
    color: "text-emerald-500",
  },
  {
    label: "Invoices",
    icon: FileText,
    href: "/dashboard/invoices",
    color: "text-green-700",
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/dashboard/inventory",
    color: "text-blue-600",
  },
  {
    label: "Locations",
    icon: Store,
    href: "/dashboard/locations",
    color: "text-yellow-500",
  },
  {
    label: "Analytics",
    icon: BarChart4,
    href: "/dashboard/analytics",
    color: "text-purple-500",
  },
  {
    label: "Reports",
    icon: ClipboardList,
    href: "/dashboard/reports",
    color: "text-red-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500",
  },
]

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Mock user data
  const user = {
    name: "Admin User",
    role: "Administrator",
    id: "admin_1",
  }
  const isLoading = false

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
      <SidebarProvider>
        <AppSidebar />
        <main className="relative flex gap-5 w-full items-center flex-col">
          <div className="px-2 sticky flex  w-full justify-between items-center  top-0 z-50 bg-background border-b border-b-foreground/10 h-16">
          <SidebarTrigger />
          <DashboardNav />
          </div>
          <div className="px-8 py-2 flex gap-5 w-full items-center  ">
          {children}
          </div>
        </main>
      </SidebarProvider>

    // <div className="min-h-screen bg-background">
    //   {/* Mobile menu button */}
    //   {isMobile && (
    //     <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
    //       <Menu className="h-5 w-5" />
    //     </Button>
    //   )}

    //   {/* Sidebar */}
    //   <div
    //     className={`fixed inset-y-0 left-0 w-[250px] bg-background border-r border-border overflow-y-auto z-40 transition-transform duration-300 ease-in-out ${
    //       isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
    //     }`}
    //   >
    //     <div className="p-4 border-b border-border">
    //       <Link href="/dashboard" className="flex items-center">
    //         <Sparkles className="h-6 w-6 text-primary mr-2" />
    //         <span className="text-2xl font-bold">
    //           Auto<span className="text-primary">Repair</span>
    //         </span>
    //       </Link>
    //     </div>

    //     <nav className="p-2">
    //       <ul className="space-y-1">
    //         {routes.map((route) => (
    //           <li key={route.href}>
    //             <Link
    //               href={route.href}
    //               className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ${
    //                 pathname === route.href ? "bg-accent text-accent-foreground font-medium" : "text-foreground"
    //               }`}
    //               onClick={() => isMobile && setSidebarOpen(false)}
    //             >
    //               <route.icon className={`h-5 w-5 ${route.color}`} />
    //               {route.label}
    //             </Link>
    //           </li>
    //         ))}
    //       </ul>
    //     </nav>

    //     {user && (
    //       <div className="border-t border-border p-4 mt-4">
    //         <div className="flex items-center gap-3 mb-3">
    //           <Avatar className="h-9 w-9">
    //             <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    //           </Avatar>
    //           <div>
    //             <p className="text-sm font-medium">{user.name}</p>
    //             <div className="flex items-center gap-1">
    //               <p className="text-xs text-muted-foreground">{user.role}</p>
    //               {user.id === "demo_user" && (
    //                 <Badge
    //                   variant="outline"
    //                   className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    //                 >
    //                   DEMO
    //                 </Badge>
    //               )}
    //             </div>
    //           </div>
    //         </div>

    //         <div className="space-y-1">
    //           <Link
    //             href="/dashboard/profile"
    //             className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ${
    //               pathname === "/dashboard/profile" ? "bg-accent text-accent-foreground font-medium" : "text-foreground"
    //             }`}
    //             onClick={() => isMobile && setSidebarOpen(false)}
    //           >
    //             <User className="h-4 w-4" />
    //             Profile
    //           </Link>

    //           <button
    //             onClick={() => {
    //               // Mock logout function
    //               console.log("Logging out...")
    //               isMobile && setSidebarOpen(false)
    //             }}
    //             className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent text-foreground"
    //           >
    //             <LogOut className="h-4 w-4" />
    //             Logout
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </div>

    //   {/* Overlay for mobile */}
    //   {isMobile && sidebarOpen && (
    //     <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
    //   )}

    //   {/* Main content */}
    //   <div className="md:ml-[250px] min-h-screen">{children}</div>
    // </div>
  )
}
