"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, Store } from "lucide-react"
import { Input } from "@/components/ui/input"
import { previewLocations } from "@/lib/preview-data"

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredLocations = previewLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.phone.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Locations</h2>
        <Link href="/dashboard/locations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
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
        {filteredLocations.map((location) => (
          <Link key={location.id} href={`/locations/${location.id}`}>
            <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{location.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center">
                    <Store className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{location.phone}</div>
                    <div className="text-sm text-muted-foreground">Contact</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-4">{location.address}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Employees:</span>{" "}
                    <span className="font-medium">{location._count.employees}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Customers:</span>{" "}
                    <span className="font-medium">{location._count.customers}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Repair Orders:</span>{" "}
                    <span className="font-medium">{location._count.repairOrders}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Inventory Items:</span>{" "}
                    <span className="font-medium">{location._count.inventory}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No locations found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or add a new location.</p>
          <Link href="/locations/new" className="mt-4 inline-block">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
