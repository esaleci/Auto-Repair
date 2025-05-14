import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { status } = body

    // Update invoice using a transaction
    const result = await executeTransaction(async (tx) => {
      // Check if invoice exists
      const invoice = await sql`SELECT * FROM invoices WHERE id = ${id}`

      if (invoice.length === 0) {
        throw new Error("Invoice not found")
      }

      // Update invoice
      const updatedInvoice = await sql`
        UPDATE invoices
        SET 
          status = COALESCE(${status}, status),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      return updatedInvoice[0]
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating invoice:", error)

    if (error instanceof Error && error.message === "Invoice not found") {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Delete invoice using a transaction
    await executeTransaction(async (tx) => {
      // Check if invoice exists
      const invoice = await sql`SELECT id FROM invoices WHERE id = ${id}`

      if (invoice.length === 0) {
        throw new Error("Invoice not found")
      }

      // Delete related payments
      await sql`DELETE FROM payments WHERE invoice_id = ${id}`

      // Delete the invoice
      await sql`DELETE FROM invoices WHERE id = ${id}`
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting invoice:", error)

    if (error instanceof Error && error.message === "Invoice not found") {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 })
  }
}
