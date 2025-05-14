import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { description, status, employeeId, startDate, endDate, services, parts, notes } = body

    // Update repair order using a transaction
    const result = await executeTransaction(async (tx) => {
      // Check if repair order exists
      const repairOrder = await sql`SELECT * FROM repair_orders WHERE id = ${id}`

      if (repairOrder.length === 0) {
        throw new Error("Repair order not found")
      }

      // Update repair order
      const updatedOrder = await sql`
        UPDATE repair_orders
        SET 
          description = COALESCE(${description}, description),
          status = COALESCE(${status}, status),
          employee_id = COALESCE(${employeeId}, employee_id),
          start_date = COALESCE(${startDate}, start_date),
          end_date = COALESCE(${endDate}, end_date),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      // Update services if provided
      if (services && services.length > 0) {
        // Delete existing services
        await sql`DELETE FROM services WHERE repair_order_id = ${id}`

        // Add new services
        for (const service of services) {
          await sql`
            INSERT INTO services (
              name, description, price, repair_order_id, created_at, updated_at
            ) VALUES (
              ${service.name}, ${service.description}, ${service.price}, 
              ${id}, NOW(), NOW()
            )
          `
        }
      }

      // Update parts if provided
      if (parts && parts.length > 0) {
        // Get existing parts
        const existingParts = await sql`
          SELECT * FROM part_usage WHERE repair_order_id = ${id}
        `

        // Create a map of existing parts
        const existingPartsMap = new Map()
        for (const part of existingParts) {
          existingPartsMap.set(part.inventory_item_id, part)
        }

        // Process new parts
        for (const part of parts) {
          const existingPart = existingPartsMap.get(part.inventoryItemId)

          if (existingPart) {
            // Update inventory quantity based on difference
            const quantityDiff = part.quantity - existingPart.quantity

            if (quantityDiff !== 0) {
              await sql`
                UPDATE inventory_items
                SET quantity = quantity - ${quantityDiff}
                WHERE id = ${part.inventoryItemId}
              `

              // Update part usage
              await sql`
                UPDATE part_usage
                SET 
                  quantity = ${part.quantity},
                  price = ${part.price},
                  updated_at = NOW()
                WHERE id = ${existingPart.id}
              `
            }

            // Remove from map to track what's been processed
            existingPartsMap.delete(part.inventoryItemId)
          } else {
            // New part, update inventory and add usage record
            await sql`
              UPDATE inventory_items
              SET quantity = quantity - ${part.quantity}
              WHERE id = ${part.inventoryItemId}
            `

            await sql`
              INSERT INTO part_usage (
                quantity, price, inventory_item_id, repair_order_id, created_at, updated_at
              ) VALUES (
                ${part.quantity}, ${part.price}, ${part.inventoryItemId}, 
                ${id}, NOW(), NOW()
              )
            `
          }
        }

        // Return unused parts to inventory
        for (const [itemId, part] of existingPartsMap.entries()) {
          await sql`
            UPDATE inventory_items
            SET quantity = quantity + ${part.quantity}
            WHERE id = ${itemId}
          `

          await sql`DELETE FROM part_usage WHERE id = ${part.id}`
        }
      }

      // Add notes if provided
      if (notes && notes.length > 0) {
        for (const note of notes) {
          await sql`
            INSERT INTO service_notes (
              note, repair_order_id, created_at, updated_at
            ) VALUES (
              ${note}, ${id}, NOW(), NOW()
            )
          `
        }
      }

      // If status is changed to COMPLETED, create invoice
      if (status === "COMPLETED" && repairOrder[0].status !== "COMPLETED") {
        // Calculate totals
        const services = await sql`
          SELECT SUM(price) as service_total FROM services WHERE repair_order_id = ${id}
        `

        const parts = await sql`
          SELECT SUM(price * quantity) as parts_total FROM part_usage WHERE repair_order_id = ${id}
        `

        const serviceTotal = Number.parseFloat(services[0].service_total) || 0
        const partsTotal = Number.parseFloat(parts[0].parts_total) || 0
        const amount = serviceTotal + partsTotal
        const tax = amount * 0.08 // 8% tax
        const total = amount + tax

        // Generate invoice number
        const invoiceCount = await sql`SELECT COUNT(*) FROM invoices`
        const invoiceNumber = `INV-${10000 + Number.parseInt(invoiceCount[0].count) + 1}`

        // Create invoice
        await sql`
          INSERT INTO invoices (
            invoice_number, amount, tax, total, status, customer_id, repair_order_id, 
            created_at, updated_at
          ) VALUES (
            ${invoiceNumber}, ${amount}, ${tax}, ${total}, 'PENDING', 
            ${repairOrder[0].customer_id}, ${id}, NOW(), NOW()
          )
        `
      }

      return updatedOrder[0]
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating repair order:", error)

    if (error instanceof Error && error.message === "Repair order not found") {
      return NextResponse.json({ error: "Repair order not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to update repair order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Delete repair order using a transaction
    await executeTransaction(async (tx) => {
      // Check if repair order exists
      const repairOrder = await sql`SELECT id FROM repair_orders WHERE id = ${id}`

      if (repairOrder.length === 0) {
        throw new Error("Repair order not found")
      }

      // Return parts to inventory
      const parts = await sql`
        SELECT pu.inventory_item_id, pu.quantity
        FROM part_usage pu
        WHERE pu.repair_order_id = ${id}
      `

      for (const part of parts) {
        await sql`
          UPDATE inventory_items
          SET quantity = quantity + ${part.quantity}
          WHERE id = ${part.inventory_item_id}
        `
      }

      // Delete related records
      await sql`DELETE FROM services WHERE repair_order_id = ${id}`
      await sql`DELETE FROM part_usage WHERE repair_order_id = ${id}`
      await sql`DELETE FROM service_notes WHERE repair_order_id = ${id}`
      await sql`DELETE FROM appointments WHERE repair_order_id = ${id}`
      await sql`DELETE FROM invoices WHERE repair_order_id = ${id}`

      // Delete the repair order
      await sql`DELETE FROM repair_orders WHERE id = ${id}`
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting repair order:", error)

    if (error instanceof Error && error.message === "Repair order not found") {
      return NextResponse.json({ error: "Repair order not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to delete repair order" }, { status: 500 })
  }
}
