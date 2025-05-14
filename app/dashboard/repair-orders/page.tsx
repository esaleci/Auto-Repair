"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, Car } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { previewRepairOrders } from "@/lib/preview-data"

export default function RepairOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredRepairOrders = previewRepairOrders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Repair Orders</h2>
        <Link href="/dashboard/repair-orders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Repair Order
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repair orders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRepairOrders.map((order) => (
          <Link key={order.id} href={`/dashboard/repair-orders/${order.id}`}>
            <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">#{order.orderNumber}</CardTitle>
                  <Badge
                    className={
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : order.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : order.status === "COMPLETED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary" />
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
                <div className="text-sm text-muted-foreground mb-4 line-clamp-2">{order.description}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
