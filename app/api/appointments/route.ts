import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const date = searchParams.get("date")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let query = `
      SELECT a.*, 
             ro.order_number,
             ro.status as repair_order_status,
             ro.description,
             c.first_name as customer_first_name,
             c.last_name as customer_last_name,
             v.make as vehicle_make,
             v.model as vehicle_model,
             v.year as vehicle_year,
             l.name as location_name
      FROM appointments a
      JOIN repair_orders ro ON a.repair_order_id = ro.id
      JOIN customers c ON ro.customer_id = c.id
      JOIN vehicles v ON ro.vehicle_id = v.id
      JOIN locations l ON ro.location_id = l.id
    `

    const queryParams: any[] = []
    const conditions = []
    let paramIndex = 1

    if (id) {
      conditions.push(`a.id = $${paramIndex++}`)
      queryParams.push(id)
    }

    if (date) {
      conditions.push(`DATE(a.date) = DATE($${paramIndex++})`)
      queryParams.push(date)
    }

    if (startDate && endDate) {
      conditions.push(`a.date BETWEEN $${paramIndex++} AND $${paramIndex++}`)
      queryParams.push(startDate, endDate)
    } else if (startDate) {
      conditions.push(`a.date >= $${paramIndex++}`)
      queryParams.push(startDate)
    } else if (endDate) {
      conditions.push(`a.date <= $${paramIndex++}`)
      queryParams.push(endDate)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += ` ORDER BY a.date`

    const appointments = await sql.query(query, queryParams)

    if (id && appointments.length === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: id ? appointments[0] : appointments,
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, repairOrderId } = body

    // Validate required fields
    if (!date || !repairOrderId) {
      return NextResponse.json({ error: "Date and repair order are required" }, { status: 400 })
    }

    // Create appointment using a transaction
    const result = await executeTransaction(async (tx) => {
      // Check if repair order exists
      const repairOrder = await sql`SELECT id FROM repair_orders WHERE id = ${repairOrderId}`

      if (repairOrder.length === 0) {
        throw new Error("Repair order not found")
      }

      // Check if appointment already exists for this repair order
      const existingAppointment = await sql`
        SELECT id FROM appointments WHERE repair_order_id = ${repairOrderId}
      `

      if (existingAppointment.length > 0) {
        throw new Error("Appointment already exists for this repair order")
      }

      // Create appointment
      const appointment = await sql`
        INSERT INTO appointments (
          date, repair_order_id, created_at, updated_at
        ) VALUES (
          ${date}, ${repairOrderId}, NOW(), NOW()
        )
        RETURNING *
      `

      return appointment[0]
    })

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)

    if (error instanceof Error) {
      if (error.message === "Repair order not found") {
        return NextResponse.json({ error: "Repair order not found" }, { status: 404 })
      }
      if (error.message === "Appointment already exists for this repair order") {
        return NextResponse.json({ error: "Appointment already exists for this repair order" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
