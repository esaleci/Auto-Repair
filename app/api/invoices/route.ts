import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const customerId = searchParams.get("customerId")
    const status = searchParams.get("status")

    if (id) {
      // Get a specific invoice with payment details
      const invoice = await sql`
        SELECT i.*, 
               c.first_name as customer_first_name,
               c.last_name as customer_last_name,
               ro.order_number as repair_order_number,
               (
                 SELECT COALESCE(SUM(amount), 0)
                 FROM payments
                 WHERE invoice_id = i.id
               ) as paid_amount
        FROM invoices i
        JOIN customers c ON i.customer_id = c.id
        JOIN repair_orders ro ON i.repair_order_id = ro.id
        WHERE i.id = ${id}
      `

      if (invoice.length === 0) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
      }

      // Get payments for this invoice
      const payments = await sql`
        SELECT * FROM payments WHERE invoice_id = ${id} ORDER BY created_at DESC
      `

      return NextResponse.json({
        success: true,
        data: {
          ...invoice[0],
          payments,
        },
      })
    } else {
      let query = `
        SELECT i.*, 
               c.first_name as customer_first_name,
               c.last_name as customer_last_name,
               ro.order_number as repair_order_number,
               (
                 SELECT COALESCE(SUM(amount), 0)
                 FROM payments
                 WHERE invoice_id = i.id
               ) as paid_amount
        FROM invoices i
        JOIN customers c ON i.customer_id = c.id
        JOIN repair_orders ro ON i.repair_order_id = ro.id
      `

      const queryParams: any[] = []
      const conditions = []
      let paramIndex = 1

      if (customerId) {
        conditions.push(`i.customer_id = $${paramIndex++}`)
        queryParams.push(customerId)
      }

      if (status) {
        conditions.push(`i.status = $${paramIndex++}`)
        queryParams.push(status)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY i.created_at DESC`

      const invoices = await sql.query(query, queryParams)

      return NextResponse.json({ success: true, data: invoices })
    }
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}
