"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, Car } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Sample data for vehicles
const vehicles = [
  {
    id: "veh_01",
    make: "Toyota",
    model: "Camry",
    year: 2018,
    vin: "JT2BF22K1W0123456",
    licensePlate: "ABC-1234",
    color: "Silver",
    customer: {
      firstName: "Alice",
      lastName: "Cooper",
    },
  },
  {
    id: "veh_02",
    make: "Honda",
    model: "Civic",
    year: 2019,
    vin: "JHMEJ6674YS012345",
    licensePlate: "DEF-5678",
    color: "Blue",
    customer: {
      firstName: "Bob",
      lastName: "Dylan",
    },
  },
  {
    id: "veh_03",
    make: "Ford",
    model: "F-150",
    year: 2020,
    vin: "1FTEW1E53LFA12345",
    licensePlate: "GHI-9012",
    color: "Black",
    customer: {
      firstName: "Charlie",
      lastName: "Parker",
    },
  },
  {
    id: "veh_06",
    make: "BMW",
    model: "3 Series",
    year: 2019,
    vin: "WBA8E5G56GNT12345",
    licensePlate: "PQR-1234",
    color: "Black",
    customer: {
      firstName: "Frank",
      lastName: "Sinatra",
    },
  },
  {
    id: "veh_07",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2020,
    vin: "WDDWF4KB2FR123456",
    licensePlate: "STU-5678",
    color: "Silver",
    customer: {
      firstName: "Gloria",
      lastName: "Estefan",
    },
  },
  {
    id: "veh_08",
    make: "Audi",
    model: "A4",
    year: 2018,
    vin: "WAUZZZ8K9JA123456",
    licensePlate: "VWX-9012",
    color: "Blue",
    customer: {
      firstName: "Harry",
      lastName: "Styles",
    },
  },
]

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vehicles</h2>
        <Link href="/vehicles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
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
        {filteredVehicles.map((vehicle) => (
          <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
            <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {vehicle.make} {vehicle.model}
                  </CardTitle>
                  <Badge variant="outline" className="bg-primary/10">
                    {vehicle.year}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center">
                    <Car className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {vehicle.customer.firstName} {vehicle.customer.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">Owner</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">License:</span>{" "}
                    <span className="font-medium">{vehicle.licensePlate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Color:</span>{" "}
                    <span className="font-medium">{vehicle.color}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">VIN:</span>{" "}
                    <span className="font-medium">{vehicle.vin}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No vehicles found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or add a new vehicle.</p>
          <Link href="/vehicles/new" className="mt-4 inline-block">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
