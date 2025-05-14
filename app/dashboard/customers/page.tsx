"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { previewCustomers } from "@/lib/preview-data"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredCustomers = previewCustomers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Link href="/dashboard/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Link key={customer.id} href={`/customers/${customer.id}`}>
            <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {customer.firstName} {customer.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium text-foreground">{customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium text-foreground">{customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium text-foreground">{customer.location.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicles:</span>
                    <span className="font-medium text-foreground">{customer.vehicles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repair Orders:</span>
                    <span className="font-medium text-foreground">{customer._count.repairOrders}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No customers found</h3>
          <p className="text-muted-foreground mt-2">Get started by adding your first customer.</p>
          <Link href="/dashboard/customers/new" className="mt-4 inline-block">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
