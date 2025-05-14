"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { repairTimeData } from "@/lib/chart-data"

export function RepairTimeChart() {
  // Ensure data is never undefined
  const safeData = repairTimeData || []

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Repair Time Analytics</CardTitle>
        <CardDescription>Average time spent on repairs this week</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <ChartContainer
          config={{
            hours: {
              label: "Hours",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}h`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="hours" fill="var(--color-hours)" radius={[4, 4, 0, 0]} barSize={30} name="Average Hours" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
