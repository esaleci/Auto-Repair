"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useState } from "react"

// Import preview data
import { previewData } from "@/lib/preview-data"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(previewData.recentInvoices)

  // For a real application, you would fetch data from the API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/invoices')
  //       const result = await response.json()
  //       if (result.success) {
  //         setInvoices(result.data)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching invoices:', error)
  //     }
  //   }
  //
  //   fetchData()
  // }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Link key={invoice.id} href={`/invoices/${invoice.id}`}>
            <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Invoice #{invoice.invoiceNumber}</CardTitle>
                  <div
                    className={`rounded-full px-2 py-1 text-xs ${
                      invoice.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : invoice.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "PARTIAL"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {invoice.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Customer</div>
                    <div className="font-medium">
                      {invoice.customer.firstName} {invoice.customer.lastName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Order #</div>
                    <div className="font-medium">{invoice.repairOrder.orderNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">{formatDate(invoice.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-medium">{formatCurrency(invoice.total)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {invoices.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No invoices found</h3>
          <p className="text-muted-foreground mt-2">Invoices will appear here when repair orders are completed.</p>
        </div>
      )}
    </div>
  )
}
