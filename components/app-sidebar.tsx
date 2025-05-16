"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
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
  Sparkles,
  LogOut,
  User,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

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

export function AppSidebar() {
  const pathname = usePathname()
  // let { user } = useAuth()

  // if(!user){
    const user = {
    name: "Admin User",
    role: "Administrator",
    id: "admin_1",
     }
  // }
  return (
    <Sidebar>
      <SidebarHeader className="pb-0">
        <Link href="/" className="flex items-center px-3 py-2">
          <Sparkles className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold">
            Auto<span className="text-primary">Repair</span>
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.label}>
                    <Link href={route.href}>
                      <route.icon className={cn("h-5 w-5", route.color)} />
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="bg-primary/10 rounded-lg p-3 text-sm mx-2">
          <div className="font-medium mb-1 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            Pro Tip
          </div>
          <p className="text-muted-foreground text-xs">
            Schedule regular maintenance reminders to increase customer retention.
          </p>
        </div>

        {user && (
          <div className="mt-4 border-t pt-4 mx-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center">
                   <Avatar className="h-9 w-9">
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                {/* <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={undefined || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar> */}
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                    {user.id === "demo_user" && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      >
                        DEMO
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/profile"} tooltip="Profile">
                  <Link href="/dashboard/profile">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton  tooltip="Logout">
                  <LogOut className="h-5 w-5 text-gray-500" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
