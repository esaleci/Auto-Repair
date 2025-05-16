"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Calendar, Clock, Car, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { previewData } from "@/lib/preview-data"
import { formatDate } from "@/lib/utils"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(previewData.upcomingAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // For a real application, you would fetch data from the API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/appointments')
  //       const result = await response.json()
  //       if (result.success) {
  //         setAppointments(result.data)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching appointments:', error)
  //     }
  //   }
  //
  //   fetchData()
  // }, [])

  const filteredAppointments = appointments.filter((appointment) => {
    const customerName =
      `${appointment.repairOrder.customer.firstName} ${appointment.repairOrder.customer.lastName}`.toLowerCase()
    const vehicleInfo = `${appointment.repairOrder.vehicle.make} ${appointment.repairOrder.vehicle.model}`.toLowerCase()

    return customerName.includes(searchTerm.toLowerCase()) || vehicleInfo.includes(searchTerm.toLowerCase())
  })

  // Group appointments by date
  const groupedAppointments = filteredAppointments.reduce(
    (groups, appointment) => {
      const date = new Date(appointment.date).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(appointment)
      return groups
    },
    {} as Record<string, typeof appointments>,
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
        <Link href="/dashboard/repair-orders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Appointments</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6 ">
        {Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
          <div key={date} className="space-y-4 ">
            <h3 className="text-lg font-semibold">{formatDate(new Date(date))}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dateAppointments.map((appointment) => (
                <Link key={appointment.id} href={`/dashboard/repair-orders/${appointment.repairOrder.id}`}>
                  <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {appointment.repairOrder.customer.firstName} {appointment.repairOrder.customer.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">Customer</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {appointment.repairOrder.vehicle.make} {appointment.repairOrder.vehicle.model}
                            </div>
                            <div className="text-sm text-muted-foreground">Vehicle</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {new Date(appointment.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -
                              {new Date(new Date(appointment.date).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">Estimated Duration</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No appointments found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? "Try adjusting your search." : "Schedule your first appointment."}
          </p>
          <Link href="/repair-orders/new" className="mt-4 inline-block">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
