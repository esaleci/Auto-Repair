import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (id) {
      // Get a specific customer
      const customer = await sql`
        SELECT c.*, 
               COUNT(v.id) as vehicle_count,
               COUNT(ro.id) as repair_order_count
        FROM customers c
        LEFT JOIN vehicles v ON c.id = v.customer_id
        LEFT JOIN repair_orders ro ON c.id = ro.customer_id
        WHERE c.id = ${id}
        GROUP BY c.id
      `

      if (customer.length === 0) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, data: customer[0] })
    } else {
      // Get all customers
      const customers = await sql`
        SELECT c.*, 
               COUNT(v.id) as vehicle_count,
               COUNT(ro.id) as repair_order_count
        FROM customers c
        LEFT JOIN vehicles v ON c.id = v.customer_id
        LEFT JOIN repair_orders ro ON c.id = ro.customer_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `

      return NextResponse.json({ success: true, data: customers })
    }
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, address, locationId } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !locationId) {
      return NextResponse.json({ error: "First name, last name, email, and location are required" }, { status: 400 })
    }

    // Create customer using a transaction
    const result = await executeTransaction(async (tx) => {
      const customer = await sql`
        INSERT INTO customers (
          first_name, last_name, email, phone, address, location_id, created_at, updated_at
        ) VALUES (
          ${firstName}, ${lastName}, ${email}, ${phone}, ${address}, ${locationId}, NOW(), NOW()
        )
        RETURNING *
      `

      return customer[0]
    })

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
