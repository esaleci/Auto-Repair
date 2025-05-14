import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const customerId = searchParams.get("customerId")
    const vehicleId = searchParams.get("vehicleId")
    const status = searchParams.get("status")

    let query = `
      SELECT ro.*, 
             c.first_name as customer_first_name,
             c.last_name as customer_last_name,
             v.make as vehicle_make,
             v.model as vehicle_model,
             v.year as vehicle_year,
             l.name as location_name,
             e.first_name as employee_first_name,
             e.last_name as employee_last_name
      FROM repair_orders ro
      JOIN customers c ON ro.customer_id = c.id
      JOIN vehicles v ON ro.vehicle_id = v.id
      JOIN locations l ON ro.location_id = l.id
      JOIN employees e ON ro.employee_id = e.id
    `

    const queryParams: any[] = []

    if (id) {
      query += ` WHERE ro.id = $1`
      queryParams.push(id)
    } else {
      const conditions = []
      let paramIndex = 1

      if (customerId) {
        conditions.push(`ro.customer_id = $${paramIndex++}`)
        queryParams.push(customerId)
      }

      if (vehicleId) {
        conditions.push(`ro.vehicle_id = $${paramIndex++}`)
        queryParams.push(vehicleId)
      }

      if (status) {
        conditions.push(`ro.status = $${paramIndex++}`)
        queryParams.push(status)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY ro.created_at DESC`
    }

    const repairOrders = await sql.query(query, queryParams)

    if (id && repairOrders.length === 0) {
      return NextResponse.json({ error: "Repair order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: id ? repairOrders[0] : repairOrders,
    })
  } catch (error) {
    console.error("Error fetching repair orders:", error)
    return NextResponse.json({ error: "Failed to fetch repair orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, vehicleId, description, locationId, employeeId, startDate, status, services, parts } = body

    // Validate required fields
    if (!customerId || !vehicleId || !description || !locationId || !employeeId) {
      return NextResponse.json(
        { error: "Customer, vehicle, description, location, and employee are required" },
        { status: 400 },
      )
    }

    // Create repair order using a transaction
    const result = await executeTransaction(async (tx) => {
      // Generate order number
      const orderCount = await sql`SELECT COUNT(*) FROM repair_orders`
      const orderNumber = `RO-${100000 + Number.parseInt(orderCount[0].count) + 1}`

      // Create repair order
      const repairOrder = await sql`
        INSERT INTO repair_orders (
          order_number, status, description, customer_id, vehicle_id, 
          employee_id, location_id, start_date, created_at, updated_at
        ) VALUES (
          ${orderNumber}, ${status || "PENDING"}, ${description}, ${customerId}, 
          ${vehicleId}, ${employeeId}, ${locationId}, ${startDate || new Date()}, 
          NOW(), NOW()
        )
        RETURNING *
      `

      const repairOrderId = repairOrder[0].id

      // Add services if provided
      if (services && services.length > 0) {
        for (const service of services) {
          await sql`
            INSERT INTO services (
              name, description, price, repair_order_id, created_at, updated_at
            ) VALUES (
              ${service.name}, ${service.description}, ${service.price}, 
              ${repairOrderId}, NOW(), NOW()
            )
          `
        }
      }

      // Add parts if provided
      if (parts && parts.length > 0) {
        for (const part of parts) {
          // Update inventory quantity
          await sql`
            UPDATE inventory_items
            SET quantity = quantity - ${part.quantity}
            WHERE id = ${part.inventoryItemId}
          `

          // Add part usage record
          await sql`
            INSERT INTO part_usage (
              quantity, price, inventory_item_id, repair_order_id, created_at, updated_at
            ) VALUES (
              ${part.quantity}, ${part.price}, ${part.inventoryItemId}, 
              ${repairOrderId}, NOW(), NOW()
            )
          `
        }
      }

      // Create appointment if start date is in the future
      const now = new Date()
      const startDateObj = new Date(startDate)

      if (startDateObj > now) {
        await sql`
          INSERT INTO appointments (
            date, repair_order_id, created_at, updated_at
          ) VALUES (
            ${startDate}, ${repairOrderId}, NOW(), NOW()
          )
        `
      }

      return {
        ...repairOrder[0],
        services: services || [],
        parts: parts || [],
      }
    })

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating repair order:", error)
    return NextResponse.json({ error: "Failed to create repair order" }, { status: 500 })
  }
}
