"use server"

import { sql, executeTransaction } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createPayment(formData: FormData) {
  try {
    const amount = Number.parseFloat(formData.get("amount") as string)
    const method = formData.get("method") as string
    const reference = formData.get("reference") as string
    const invoiceId = formData.get("invoiceId") as string

    // Validate required fields
    if (isNaN(amount) || !method || !invoiceId) {
      return {
        success: false,
        error: "Amount, payment method, and invoice are required",
      }
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

    revalidatePath(`/invoices/${result.invoice_id}`)
    revalidatePath("/invoices")

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error creating payment:", error)

    if (error instanceof Error && error.message === "Invoice not found") {
      return {
        success: false,
        error: "Invoice not found",
      }
    }

    return {
      success: false,
      error: "Failed to create payment",
    }
  }
}

export async function deletePayment(paymentId: string) {
  try {
    let invoiceId: string | null = null

    // Delete payment using a transaction
    await executeTransaction(async (tx) => {
      // Check if payment exists
      const payment = await sql`SELECT id, invoice_id FROM payments WHERE id = ${paymentId}`

      if (payment.length === 0) {
        throw new Error("Payment not found")
      }

      invoiceId = payment[0].invoice_id

      // Delete the payment
      await sql`DELETE FROM payments WHERE id = ${paymentId}`

      // Update invoice status
      if (invoiceId) {
        // Get total payments for this invoice
        const totalPayments = await sql`
          SELECT COALESCE(SUM(amount), 0) as total
          FROM payments
          WHERE invoice_id = ${invoiceId}
        `

        const invoice = await sql`SELECT total FROM invoices WHERE id = ${invoiceId}`

        if (invoice.length > 0) {
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
        }
      }
    })

    if (invoiceId) {
      revalidatePath(`/invoices/${invoiceId}`)
      revalidatePath("/invoices")
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting payment:", error)

    if (error instanceof Error && error.message === "Payment not found") {
      return {
        success: false,
        error: "Payment not found",
      }
    }

    return {
      success: false,
      error: "Failed to delete payment",
    }
  }
}
