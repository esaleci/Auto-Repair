import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { firstName, lastName, email, phone, address, locationId } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !locationId) {
      return NextResponse.json({ error: "First name, last name, email, and location are required" }, { status: 400 })
    }

    // Update customer using a transaction
    const result = await executeTransaction(async (tx) => {
      const customer = await sql`
        UPDATE customers
        SET 
          first_name = ${firstName},
          last_name = ${lastName},
          email = ${email},
          phone = ${phone},
          address = ${address},
          location_id = ${locationId},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      if (customer.length === 0) {
        throw new Error("Customer not found")
      }

      return customer[0]
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating customer:", error)

    if (error instanceof Error && error.message === "Customer not found") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Delete customer using a transaction
    await executeTransaction(async (tx) => {
      // Check if customer exists
      const customer = await sql`SELECT id FROM customers WHERE id = ${id}`

      if (customer.length === 0) {
        throw new Error("Customer not found")
      }

      // Delete related records first
      await sql`DELETE FROM vehicles WHERE customer_id = ${id}`
      await sql`DELETE FROM repair_orders WHERE customer_id = ${id}`

      // Delete the customer
      await sql`DELETE FROM customers WHERE id = ${id}`
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting customer:", error)

    if (error instanceof Error && error.message === "Customer not found") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
