import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const customerId = searchParams.get("customerId")

    if (id) {
      // Get a specific vehicle
      const vehicle = await sql`
        SELECT v.*, 
               c.first_name as customer_first_name,
               c.last_name as customer_last_name,
               COUNT(ro.id) as repair_order_count
        FROM vehicles v
        JOIN customers c ON v.customer_id = c.id
        LEFT JOIN repair_orders ro ON v.id = ro.vehicle_id
        WHERE v.id = ${id}
        GROUP BY v.id, c.first_name, c.last_name
      `

      if (vehicle.length === 0) {
        return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, data: vehicle[0] })
    } else if (customerId) {
      // Get vehicles for a specific customer
      const vehicles = await sql`
        SELECT v.*, 
               COUNT(ro.id) as repair_order_count
        FROM vehicles v
        LEFT JOIN repair_orders ro ON v.id = ro.vehicle_id
        WHERE v.customer_id = ${customerId}
        GROUP BY v.id
        ORDER BY v.created_at DESC
      `

      return NextResponse.json({ success: true, data: vehicles })
    } else {
      // Get all vehicles
      const vehicles = await sql`
        SELECT v.*, 
               c.first_name as customer_first_name,
               c.last_name as customer_last_name,
               COUNT(ro.id) as repair_order_count
        FROM vehicles v
        JOIN customers c ON v.customer_id = c.id
        LEFT JOIN repair_orders ro ON v.id = ro.vehicle_id
        GROUP BY v.id, c.first_name, c.last_name
        ORDER BY v.created_at DESC
      `

      return NextResponse.json({ success: true, data: vehicles })
    }
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { make, model, year, vin, licensePlate, color, customerId } = body

    // Validate required fields
    if (!make || !model || !year || !customerId) {
      return NextResponse.json({ error: "Make, model, year, and customer are required" }, { status: 400 })
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

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating vehicle:", error)

    if (error instanceof Error && error.message === "Customer not found") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 })
  }
}
