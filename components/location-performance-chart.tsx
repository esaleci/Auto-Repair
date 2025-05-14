"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { locationPerformanceData } from "@/lib/chart-data"

export function LocationPerformanceChart() {
  // Ensure data is never undefined
  const safeData = locationPerformanceData || []

  // Custom colors for the pie chart
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Location Performance</CardTitle>
        <CardDescription>Repair orders by location</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] w-full mb-4">
          <ChartContainer
           config={{
            value: {
              label: "name",
              color: "hsl(var(--chart-1))",
            },
          }}
         
          className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {safeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="space-y-2">
          {safeData.map((location, index) => (
            <div key={location.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="font-medium">{location.name}</div>
              </div>
              <div className="text-sm">{location.value} orders</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
