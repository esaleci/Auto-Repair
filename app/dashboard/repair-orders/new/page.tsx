"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import { previewCustomers, previewLocations } from "@/lib/preview-data"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewRepairOrderPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",
    description: "",
    locationId: "",
    employeeId: "",
    startDate: "",
    status: "PENDING",
  })

  // Sample data for vehicles and employees
  const vehicles = [
    { id: "veh_01", make: "Toyota", model: "Camry", year: 2018, customerId: "cust_01" },
    { id: "veh_02", make: "Honda", model: "Civic", year: 2019, customerId: "cust_02" },
    { id: "veh_03", make: "Ford", model: "F-150", year: 2020, customerId: "cust_03" },
  ]

  const employees = [
    { id: "emp_03", firstName: "Mike", lastName: "Williams", role: "TECHNICIAN", locationId: "loc_downtown" },
    { id: "emp_05", firstName: "David", lastName: "Miller", role: "TECHNICIAN", locationId: "loc_downtown" },
    { id: "emp_08", firstName: "Thomas", lastName: "Taylor", role: "TECHNICIAN", locationId: "loc_uptown" },
    { id: "emp_10", firstName: "James", lastName: "Jackson", role: "TECHNICIAN", locationId: "loc_uptown" },
  ]

  const inventoryItems = [
    { id: "inv_01", name: "Oil Filter", partNumber: "OF-12345", price: 12.99, quantity: 50 },
    { id: "inv_02", name: "Air Filter", partNumber: "AF-67890", price: 24.99, quantity: 35 },
    { id: "inv_03", name: "Brake Pads", partNumber: "BP-54321", price: 89.99, quantity: 20 },
    { id: "inv_04", name: "Brake Rotors", partNumber: "BR-09876", price: 129.99, quantity: 15 },
    { id: "inv_05", name: "Spark Plugs", partNumber: "SP-13579", price: 49.99, quantity: 30 },
  ]

  const services = [
    {
      id: "svc_01",
      name: "Oil Change",
      description: "Full synthetic oil change with filter replacement",
      price: 89.99,
    },
    { id: "svc_02", name: "Tire Rotation", description: "Rotate all four tires and check pressure", price: 49.99 },
    { id: "svc_03", name: "Brake Pad Replacement", description: "Replace front brake pads", price: 199.99 },
    { id: "svc_04", name: "Rotor Resurfacing", description: "Resurface front brake rotors", price: 149.99 },
    { id: "svc_05", name: "Engine Diagnostic", description: "Diagnose engine misfire issue", price: 129.99 },
  ]

  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedParts, setSelectedParts] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const handlePartToggle = (partId: string) => {
    setSelectedParts((prev) => (prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/repair-orders")
    }, 1000)
  }

  // Filter vehicles based on selected customer
  const filteredVehicles = vehicles.filter(
    (vehicle) => !formData.customerId || vehicle.customerId === formData.customerId,
  )

  // Filter employees based on selected location
  const filteredEmployees = employees.filter(
    (employee) => !formData.locationId || employee.locationId === formData.locationId,
  )

  // Calculate total
  const servicesTotal = selectedServices.reduce(
    (total, serviceId) => total + (services.find((s) => s.id === serviceId)?.price || 0),
    0,
  )

  const partsTotal = selectedParts.reduce(
    (total, partId) => total + (inventoryItems.find((p) => p.id === partId)?.price || 0),
    0,
  )

  const subtotal = servicesTotal + partsTotal
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/repair-orders">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Create Repair Order</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="services">Services & Parts</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Repair Order Details</CardTitle>
                <CardDescription>Enter the basic information for this repair order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="customerId">Customer</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => handleSelectChange("customerId", value)}
                    >
                      <SelectTrigger id="customerId">
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {previewCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">Vehicle</Label>
                    <Select
                      value={formData.vehicleId}
                      onValueChange={(value) => handleSelectChange("vehicleId", value)}
                      disabled={!formData.customerId}
                    >
                      <SelectTrigger id="vehicleId">
                        <SelectValue
                          placeholder={formData.customerId ? "Select a vehicle" : "Select a customer first"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="locationId">Service Location</Label>
                    <Select
                      value={formData.locationId}
                      onValueChange={(value) => handleSelectChange("locationId", value)}
                    >
                      <SelectTrigger id="locationId">
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        {previewLocations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Assigned Technician</Label>
                    <Select
                      value={formData.employeeId}
                      onValueChange={(value) => handleSelectChange("employeeId", value)}
                      disabled={!formData.locationId}
                    >
                      <SelectTrigger id="employeeId">
                        <SelectValue
                          placeholder={formData.locationId ? "Select a technician" : "Select a location first"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredEmployees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Scheduled Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the repair needs and customer concerns"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>Select the services to be performed.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2 border-b pb-2">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={`service-${service.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {service.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        <div className="text-sm font-medium">${service.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parts</CardTitle>
                  <CardDescription>Select the parts to be used.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryItems.map((part) => (
                      <div key={part.id} className="flex items-center space-x-2 border-b pb-2">
                        <Checkbox
                          id={`part-${part.id}`}
                          checked={selectedParts.includes(part.id)}
                          onCheckedChange={() => handlePartToggle(part.id)}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={`part-${part.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {part.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">Part #: {part.partNumber}</p>
                        </div>
                        <div className="text-sm font-medium">${part.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Services Total:</span>
                    <span>${servicesTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parts Total:</span>
                    <span>${partsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/repair-orders")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Order...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Repair Order
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
