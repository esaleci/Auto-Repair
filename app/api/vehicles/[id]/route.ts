import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { make, model, year, vin, licensePlate, color, customerId } = body

    // Validate required fields
    if (!make || !model || !year || !customerId) {
      return NextResponse.json({ error: "Make, model, year, and customer are required" }, { status: 400 })
    }

    // Update vehicle using a transaction
    const result = await executeTransaction(async (tx) => {
      // Check if customer exists
      const customer = await sql`SELECT id FROM customers WHERE id = ${customerId}`

      if (customer.length === 0) {
        throw new Error("Customer not found")
      }

      const vehicle = await sql`
        UPDATE vehicles
        SET 
          make = ${make},
          model = ${model},
          year = ${year},
          vin = ${vin},
          license_plate = ${licensePlate},
          color = ${color},
          customer_id = ${customerId},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      if (vehicle.length === 0) {
        throw new Error("Vehicle not found")
      }

      return vehicle[0]
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating vehicle:", error)

    if (error instanceof Error) {
      if (error.message === "Customer not found") {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 })
      }
      if (error.message === "Vehicle not found") {
        return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Delete vehicle using a transaction
    await executeTransaction(async (tx) => {
      // Check if vehicle exists
      const vehicle = await sql`SELECT id FROM vehicles WHERE id = ${id}`

      if (vehicle.length === 0) {
        throw new Error("Vehicle not found")
      }

      // Delete related records first
      await sql`DELETE FROM repair_orders WHERE vehicle_id = ${id}`

      // Delete the vehicle
      await sql`DELETE FROM vehicles WHERE id = ${id}`
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting vehicle:", error)

    if (error instanceof Error && error.message === "Vehicle not found") {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 })
  }
}
