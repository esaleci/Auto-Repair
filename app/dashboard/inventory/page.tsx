"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, Package, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import preview data
import { previewInventory } from "@/lib/preview-data"

export default function InventoryPage() {
  const [inventory, setInventory] = useState(previewInventory)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter inventory based on search term
  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get low stock items
  const lowStockItems = filteredInventory.filter((item) => item.quantity < 20)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <Link href="/dashboard/inventory/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="low-stock">
            Low Stock
            {lowStockItems.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {lowStockItems.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredInventory.map((item) => (
              <Link key={item.id} href={`/inventory/${item.id}`}>
                <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      {item.quantity < 10 ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Low Stock
                        </Badge>
                      ) : item.quantity < 20 ? (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        >
                          Reorder Soon
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          In Stock
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{item.partNumber}</div>
                        <div className="text-sm text-muted-foreground">Part Number</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Price:</span>{" "}
                        <span className="font-medium">{formatCurrency(item.price)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>{" "}
                        <span
                          className={`font-medium ${item.quantity < 10 ? "text-red-500 dark:text-red-400" : item.quantity < 20 ? "text-yellow-500 dark:text-yellow-400" : "text-foreground"}`}
                        >
                          {item.quantity}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Location:</span>{" "}
                        <span className="font-medium">{item.location.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No inventory items found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or add a new inventory item.</p>
              <Link href="/inventory/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
        <TabsContent value="low-stock" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lowStockItems.map((item) => (
              <Link key={item.id} href={`/inventory/${item.id}`}>
                <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      {item.quantity < 10 ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        >
                          Reorder Soon
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{item.partNumber}</div>
                        <div className="text-sm text-muted-foreground">Part Number</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Price:</span>{" "}
                        <span className="font-medium">{formatCurrency(item.price)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>{" "}
                        <span
                          className={`font-medium ${item.quantity < 10 ? "text-red-500 dark:text-red-400" : "text-yellow-500 dark:text-yellow-400"}`}
                        >
                          {item.quantity}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Location:</span>{" "}
                        <span className="font-medium">{item.location.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {lowStockItems.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No low stock items found</h3>
              <p className="text-muted-foreground mt-2">All inventory items have sufficient stock levels.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
