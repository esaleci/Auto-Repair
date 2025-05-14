"use server"

import { sql, executeTransaction } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createVehicle(formData: FormData) {
  try {
    const make = formData.get("make") as string
    const model = formData.get("model") as string
    const year = Number.parseInt(formData.get("year") as string)
    const vin = formData.get("vin") as string
    const licensePlate = formData.get("licensePlate") as string
    const color = formData.get("color") as string
    const customerId = formData.get("customerId") as string

    // Validate required fields
    if (!make || !model || !year || !customerId) {
      return {
        success: false,
        error: "Make, model, year, and customer are required",
      }
    }

    // Create vehicle using a transaction
    const result = await executeTransaction(async (tx) => {
      // Check if customer exists
      const customer = await sql`SELECT id FROM customers WHERE id = ${customerId}`

      if (customer.length === 0) {
        throw new Error("Customer not found")
      }

      const vehicle = await sql`
        INSERT INTO vehicles (
          make, model, year, vin, license_plate, color, customer_id, created_at, updated_at
        ) VALUES (
          ${make}, ${model}, ${year}, ${vin}, ${licensePlate}, ${color}, ${customerId}, NOW(), NOW()
        )
        RETURNING *
      `

      return vehicle[0]
    })

    revalidatePath(`/customers/${result.customer_id}`)
    revalidatePath("/vehicles")

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error creating vehicle:", error)

    if (error instanceof Error && error.message === "Customer not found") {
      return {
        success: false,
        error: "Customer not found",
      }
    }

    return {
      success: false,
      error: "Failed to create vehicle",
    }
  }
}

export async function updateVehicle(vehicleId: string, formData: FormData) {
  try {
    const make = formData.get("make") as string
    const model = formData.get("model") as string
    const year = Number.parseInt(formData.get("year") as string)
    const vin = formData.get("vin") as string
    const licensePlate = formData.get("licensePlate") as string
    const color = formData.get("color") as string
    const customerId = formData.get("customerId") as string

    // Validate required fields
    if (!make || !model || !year || !customerId) {
      return {
        success: false,
        error: "Make, model, year, and customer are required",
      }
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
        WHERE id = ${vehicleId}
        RETURNING *
      `

      if (vehicle.length === 0) {
        throw new Error("Vehicle not found")
      }

      return vehicle[0]
    })

    revalidatePath(`/vehicles/${vehicleId}`)
    revalidatePath("/vehicles")
    revalidatePath(`/customers/${result.customer_id}`)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error updating vehicle:", error)

    if (error instanceof Error) {
      if (error.message === "Customer not found") {
        return {
          success: false,
          error: "Customer not found",
        }
      }
      if (error.message === "Vehicle not found") {
        return {
          success: false,
          error: "Vehicle not found",
        }
      }
    }

    return {
      success: false,
      error: "Failed to update vehicle",
    }
  }
}

export async function deleteVehicle(vehicleId: string) {
  try {
    let customerId: string | null = null

    // Delete vehicle using a transaction
    await executeTransaction(async (tx) => {
      // Check if vehicle exists and get customer ID
      const vehicle = await sql`SELECT id, customer_id FROM vehicles WHERE id = ${vehicleId}`

      if (vehicle.length === 0) {
        throw new Error("Vehicle not found")
      }

      customerId = vehicle[0].customer_id

      // Delete related records first
      await sql`DELETE FROM repair_orders WHERE vehicle_id = ${vehicleId}`

      // Delete the vehicle
      await sql`DELETE FROM vehicles WHERE id = ${vehicleId}`
    })

    revalidatePath("/vehicles")
    if (customerId) {
      revalidatePath(`/customers/${customerId}`)
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting vehicle:", error)

    if (error instanceof Error && error.message === "Vehicle not found") {
      return {
        success: false,
        error: "Vehicle not found",
      }
    }

    return {
      success: false,
      error: "Failed to delete vehicle",
    }
  }
}
