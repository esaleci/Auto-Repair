"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, FileText, Filter, Printer, Share2 } from "lucide-react"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("financial")
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 30),
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="md:w-80">
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
            <CardDescription>Configure your report parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial Summary</SelectItem>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="customer">Customer Report</SelectItem>
                  <SelectItem value="technician">Technician Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="downtown">Downtown Auto Repair</SelectItem>
                  <SelectItem value="uptown">Uptown Auto Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Group By</label>
              <Select defaultValue="day">
                <SelectTrigger>
                  <SelectValue placeholder="Select grouping" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardFooter>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="preview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="data">Data Table</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>
                      {reportType === "financial"
                        ? "Financial Summary"
                        : reportType === "sales"
                          ? "Sales Report"
                          : reportType === "inventory"
                            ? "Inventory Report"
                            : reportType === "customer"
                              ? "Customer Report"
                              : "Technician Performance"}
                    </CardTitle>
                    <CardDescription>
                      {date?.from && date?.to
                        ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
                        : "Select a date range"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Date Range
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] w-full flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Report Preview</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                        Configure your report settings and click "Generate Report" to see a preview of your report here.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle>Report Data</CardTitle>
                  <CardDescription>Raw data table view</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] w-full flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Data Table</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                        Generate a report to view the data in tabular format.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="charts">
              <Card>
                <CardHeader>
                  <CardTitle>Report Charts</CardTitle>
                  <CardDescription>Visual representation of report data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] w-full flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Charts View</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                        Generate a report to view the data visualized in charts and graphs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
