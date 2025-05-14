import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, method, reference, invoiceId } = body

    // Validate required fields
    if (!amount || !method || !invoiceId) {
      return NextResponse.json({ error: "Amount, payment method, and invoice are required" }, { status: 400 })
    }

    // Create payment using a transaction
    const result = await executeTransaction(async (tx) => {
      // Check if invoice exists
      const invoice = await sql`SELECT * FROM invoices WHERE id = ${invoiceId}`

      if (invoice.length === 0) {
        throw new Error("Invoice not found")
      }

      // Create payment
      const payment = await sql`
        INSERT INTO payments (
          amount, method, reference, invoice_id, created_at, updated_at
        ) VALUES (
          ${amount}, ${method}, ${reference}, ${invoiceId}, NOW(), NOW()
        )
        RETURNING *
      `

      // Get total payments for this invoice
      const totalPayments = await sql`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM payments
        WHERE invoice_id = ${invoiceId}
      `

      const totalPaid = Number.parseFloat(totalPayments[0].total)
      const invoiceTotal = Number.parseFloat(invoice[0].total)

      // Update invoice status based on payment
      let newStatus
      if (totalPaid >= invoiceTotal) {
        newStatus = "PAID"
      } else if (totalPaid > 0) {
        newStatus = "PARTIAL"
      } else {
        newStatus = "PENDING"
      }

      await sql`
        UPDATE invoices
        SET status = ${newStatus}, updated_at = NOW()
        WHERE id = ${invoiceId}
      `

      return payment[0]
    })

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating payment:", error)

    if (error instanceof Error && error.message === "Invoice not found") {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
