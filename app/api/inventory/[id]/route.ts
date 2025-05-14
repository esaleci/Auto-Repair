import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { name, partNumber, description, price, quantity, locationId } = body

    // Validate required fields
    if (!name || !partNumber || !price || quantity === undefined || !locationId) {
      return NextResponse.json(
        { error: "Name, part number, price, quantity, and location are required" },
        { status: 400 },
      )
    }

    // Update inventory item using a transaction
    const result = await executeTransaction(async (tx) => {
      const item = await sql`
        UPDATE inventory_items
        SET 
          name = ${name},
          part_number = ${partNumber},
          description = ${description},
          price = ${price},
          quantity = ${quantity},
          location_id = ${locationId},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      if (item.length === 0) {
        throw new Error("Inventory item not found")
      }

      return item[0]
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating inventory item:", error)

    if (error instanceof Error && error.message === "Inventory item not found") {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Delete inventory item using a transaction
    await executeTransaction(async (tx) => {
      // Check if inventory item exists
      const item = await sql`SELECT id FROM inventory_items WHERE id = ${id}`

      if (item.length === 0) {
        throw new Error("Inventory item not found")
      }

      // Check if item is used in any repair orders
      const usageCount = await sql`
        SELECT COUNT(*) FROM part_usage WHERE inventory_item_id = ${id}
      `

      if (Number.parseInt(usageCount[0].count) > 0) {
        throw new Error("Cannot delete item that is used in repair orders")
      }

      // Delete the inventory item
      await sql`DELETE FROM inventory_items WHERE id = ${id}`
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting inventory item:", error)

    if (error instanceof Error) {
      if (error.message === "Inventory item not found") {
        return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
      }
      if (error.message === "Cannot delete item that is used in repair orders") {
        return NextResponse.json({ error: "Cannot delete item that is used in repair orders" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 })
  }
}
