"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Car, ChevronRight, Filter, Plus, Settings, Wrench } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatDate } from "@/lib/utils"
import { previewData } from "@/lib/preview-data"
import { RepairTimeChart } from "@/components/repair-time-chart"
import { RevenueChart } from "@/components/revenue-chart"
import { LocationPerformanceChart } from "@/components/location-performance-chart"

export default function Dashboard() {
  const [data, setData] = useState(previewData)
  const completedOrders = data.recentRepairOrders.filter((order) => order.status === "COMPLETED").length
  const totalOrders = data.recentRepairOrders.length
  const completionPercentage = Math.round((completedOrders / totalOrders) * 100)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background flex-wrap">
      {/* Header */}
      {/* <div className="flex items-center justify-between ">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome, Admin!</h2>
          <p className="text-muted-foreground">Manage your auto repair business efficiently.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              4
            </span>
          </Button>
          <ThemeToggle />
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            AD
          </div>
        </div>
      </div> */}

      {/* Progress indicator */}
      <Card className="border-none shadow-none bg-primary/5 dark:bg-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold">{completionPercentage}% of repairs completed today</h3>
            <span className="text-muted-foreground">Today</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Quick action cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card hover:bg-accent/10 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">New Repair Order</CardTitle>
            <Wrench className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription>Create a new repair order for a customer</CardDescription>
            <Button variant="ghost" className="p-0 h-8 mt-2" asChild>
              <Link href="/dashboard/repair-orders/new">
                Create <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card hover:bg-accent/10 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Add Customer</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <CardDescription>Register a new customer in the system</CardDescription>
            <Button variant="ghost" className="p-0 h-8 mt-2" asChild>
              <Link href="/dashboard/customers/new">
                Register <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card hover:bg-accent/10 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Inventory Check</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary"
            >
              <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a1.93 1.93 0 0 0-.97 1.68v4.8a1.93 1.93 0 0 0 .97 1.68l3.65 1.9" />
              <path d="m22 17.5-9.54 5.01a.98.98 0 0 1-.91 0l-9.54-5.01a.95.95 0 0 1 0-1.67L12 10.5l9.54 5.01a.95.95 0 0 1 0 1.67Z" />
              <path d="m22 13.5-9.54 5.01a.98.98 0 0 1-.91 0l-9.54-5.01a.95.95 0 0 1 0-1.67L12 6.5l9.54 5.01a.95.95 0 0 1 0 1.67Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <CardDescription>Check and manage inventory items</CardDescription>
            <Button variant="ghost" className="p-0 h-8 mt-2" asChild>
              <Link href="/dashboard/inventory">
                View <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex  items-center justify-between flex-wrap">
            
              <CardTitle>Recent Repair Orders</CardTitle>
              <CardDescription>Overview of the most recent repair orders</CardDescription>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard/repair-orders/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentRepairOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {order.customer.firstName} {order.customer.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.vehicle.make} {order.vehicle.model} ({order.vehicle.year})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">#{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(order.startDate)}</div>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs ${
                        order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : order.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : order.status === "COMPLETED"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/repair-orders">View All Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Repair Time Analytics</CardTitle>
            <CardDescription>Average time spent on repairs this week</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
              <div className="h-[300px] w-full">
             
            </div>
          </CardContent>
        </Card> */}
         <RepairTimeChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Schedule for the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.upcomingAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="font-medium">
                      {appointment.repairOrder.customer.firstName} {appointment.repairOrder.customer.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.repairOrder.vehicle.make} {appointment.repairOrder.vehicle.model}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatDate(appointment.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/appointments">View All Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

 <RevenueChart />
        {/* <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue from completed repairs</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
              <div className="h-[300px] w-full">
              <RevenueChart />
            </div>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Items that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previewInventory
                .filter((item) => item.quantity < 20)
                .slice(0, 3)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.partNumber}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium ${item.quantity < 10 ? "text-red-500 dark:text-red-400" : "text-yellow-500 dark:text-yellow-400"}`}
                      >
                        {item.quantity} in stock
                      </div>
                      <div className="text-sm text-muted-foreground">{item.location.name}</div>
                    </div>
                  </div>
                ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/inventory">View Inventory</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Latest financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentInvoices.slice(0, 3).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {invoice.customer.firstName} {invoice.customer.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">#{invoice.invoiceNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(invoice.total)}</div>
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                        invoice.status === "PAID"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {invoice.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/invoices">View All Invoices</Link>
            </Button>
          </CardContent>
        </Card>

        <LocationPerformanceChart />
      </div>
    </div>
  )
}

const previewInventory = [
  {
    id: "inv_01",
    name: "Oil Filter",
    partNumber: "OF-12345",
    description: "Standard oil filter for most vehicles",
    price: 12.99,
    quantity: 8,
    location: { name: "Downtown Auto Repair" },
  },
  {
    id: "inv_02",
    name: "Air Filter",
    partNumber: "AF-67890",
    description: "High-performance air filter",
    price: 24.99,
    quantity: 15,
    location: { name: "Downtown Auto Repair" },
  },
  {
    id: "inv_03",
    name: "Brake Pads",
    partNumber: "BP-54321",
    description: "Ceramic brake pads - front",
    price: 89.99,
    quantity: 5,
    location: { name: "Downtown Auto Repair" },
  },
]

const previewLocations = [
  {
    id: "loc_downtown",
    name: "Downtown Auto Repair",
    address: "123 Main Street, Downtown, NY 10001",
    phone: "(212) 555-1234",
    _count: {
      employees: 5,
      customers: 5,
      repairOrders: 18,
      inventory: 8,
    },
  },
  {
    id: "loc_uptown",
    name: "Uptown Auto Repair",
    address: "456 Park Avenue, Uptown, NY 10021",
    phone: "(212) 555-5678",
    _count: {
      employees: 5,
      customers: 5,
      repairOrders: 12,
      inventory: 8,
    },
  },
]
