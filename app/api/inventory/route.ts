import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const locationId = searchParams.get("locationId")
    const lowStock = searchParams.get("lowStock")

    if (id) {
      // Get a specific inventory item
      const item = await sql`
        SELECT i.*, l.name as location_name
        FROM inventory_items i
        JOIN locations l ON i.location_id = l.id
        WHERE i.id = ${id}
      `

      if (item.length === 0) {
        return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, data: item[0] })
    } else {
      let query = `
        SELECT i.*, l.name as location_name
        FROM inventory_items i
        JOIN locations l ON i.location_id = l.id
      `

      const queryParams: any[] = []
      const conditions = []
      let paramIndex = 1

      if (locationId) {
        conditions.push(`i.location_id = $${paramIndex++}`)
        queryParams.push(locationId)
      }

      if (lowStock === "true") {
        conditions.push(`i.quantity < 20`)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY i.name`

      const items = await sql.query(query, queryParams)

      return NextResponse.json({ success: true, data: items })
    }
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, partNumber, description, price, quantity, locationId } = body

    // Validate required fields
    if (!name || !partNumber || !price || quantity === undefined || !locationId) {
      return NextResponse.json(
        { error: "Name, part number, price, quantity, and location are required" },
        { status: 400 },
      )
    }

    // Create inventory item using a transaction
    const result = await executeTransaction(async (tx) => {
      const item = await sql`
        INSERT INTO inventory_items (
          name, part_number, description, price, quantity, location_id, created_at, updated_at
        ) VALUES (
          ${name}, ${partNumber}, ${description}, ${price}, ${quantity}, ${locationId}, NOW(), NOW()
        )
        RETURNING *
      `

      return item[0]
    })

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 })
  }
}
