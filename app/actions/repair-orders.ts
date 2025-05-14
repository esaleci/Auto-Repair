"use server"

import { sql, executeTransaction } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createRepairOrder(formData: FormData) {
  try {
    const customerId = formData.get("customerId") as string
    const vehicleId = formData.get("vehicleId") as string
    const description = formData.get("description") as string
    const locationId = formData.get("locationId") as string
    const employeeId = formData.get("employeeId") as string
    const startDate = formData.get("startDate") as string
    const status = (formData.get("status") as string) || "PENDING"

    // Parse services and parts from form data
    const servicesJson = formData.get("services") as string
    const partsJson = formData.get("parts") as string

    const services = servicesJson ? JSON.parse(servicesJson) : []
    const parts = partsJson ? JSON.parse(partsJson) : []

    // Validate required fields
    if (!customerId || !vehicleId || !description || !locationId || !employeeId) {
      return {
        success: false,
        error: "Customer, vehicle, description, location, and employee are required",
      }
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
          ${orderNumber}, ${status}, ${description}, ${customerId}, 
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
      const startDateObj = startDate ? new Date(startDate) : now

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

    revalidatePath("/repair-orders")
    revalidatePath(`/customers/${result.customer_id}`)
    revalidatePath("/appointments")

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error creating repair order:", error)
    return {
      success: false,
      error: "Failed to create repair order",
    }
  }
}

export async function updateRepairOrder(repairOrderId: string, formData: FormData) {
  try {
    const description = formData.get("description") as string
    const status = formData.get("status") as string
    const employeeId = formData.get("employeeId") as string
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string

    // Parse services, parts, and notes from form data
    const servicesJson = formData.get("services") as string
    const partsJson = formData.get("parts") as string
    const notesJson = formData.get("notes") as string

    const services = servicesJson ? JSON.parse(servicesJson) : null
    const parts = partsJson ? JSON.parse(partsJson) : null
    const notes = notesJson ? JSON.parse(notesJson) : null

    // Update repair order using a transaction
    const result = await executeTransaction(async (tx) => {
      // Check if repair order exists
      const repairOrder = await sql`SELECT * FROM repair_orders WHERE id = ${repairOrderId}`

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
        WHERE id = ${repairOrderId}
        RETURNING *
      `

      // Update services if provided
      if (services) {
        // Delete existing services
        await sql`DELETE FROM services WHERE repair_order_id = ${repairOrderId}`

        // Add new services
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

      // Update parts if provided
      if (parts) {
        // Get existing parts
        const existingParts = await sql`
          SELECT * FROM part_usage WHERE repair_order_id = ${repairOrderId}
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
                ${repairOrderId}, NOW(), NOW()
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
              ${note}, ${repairOrderId}, NOW(), NOW()
            )
          `
        }
      }

      // If status is changed to COMPLETED, create invoice
      if (status === "COMPLETED" && repairOrder[0].status !== "COMPLETED") {
        // Calculate totals
        const services = await sql`
          SELECT SUM(price) as service_total FROM services WHERE repair_order_id = ${repairOrderId}
        `

        const parts = await sql`
          SELECT SUM(price * quantity) as parts_total FROM part_usage WHERE repair_order_id = ${repairOrderId}
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
            ${repairOrder[0].customer_id}, ${repairOrderId}, NOW(), NOW()
          )
        `
      }

      return updatedOrder[0]
    })

    revalidatePath(`/repair-orders/${repairOrderId}`)
    revalidatePath("/repair-orders")
    revalidatePath(`/customers/${result.customer_id}`)
    revalidatePath("/appointments")
    revalidatePath("/invoices")

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error updating repair order:", error)

    if (error instanceof Error && error.message === "Repair order not found") {
      return {
        success: false,
        error: "Repair order not found",
      }
    }

    return {
      success: false,
      error: "Failed to update repair order",
    }
  }
}

export async function deleteRepairOrder(repairOrderId: string) {
  try {
    let customerId: string | null = null

    // Delete repair order using a transaction
    await executeTransaction(async (tx) => {
      // Check if repair order exists
      const repairOrder = await sql`SELECT id, customer_id FROM repair_orders WHERE id = ${repairOrderId}`

      if (repairOrder.length === 0) {
        throw new Error("Repair order not found")
      }

      customerId = repairOrder[0].customer_id

      // Return parts to inventory
      const parts = await sql`
        SELECT pu.inventory_item_id, pu.quantity
        FROM part_usage pu
        WHERE pu.repair_order_id = ${repairOrderId}
      `

      for (const part of parts) {
        await sql`
          UPDATE inventory_items
          SET quantity = quantity + ${part.quantity}
          WHERE id = ${part.inventory_item_id}
        `
      }

      // Delete related records
      await sql`DELETE FROM services WHERE repair_order_id = ${repairOrderId}`
      await sql`DELETE FROM part_usage WHERE repair_order_id = ${repairOrderId}`
      await sql`DELETE FROM service_notes WHERE repair_order_id = ${repairOrderId}`
      await sql`DELETE FROM appointments WHERE repair_order_id = ${repairOrderId}`
      await sql`DELETE FROM invoices WHERE repair_order_id = ${repairOrderId}`

      // Delete the repair order
      await sql`DELETE FROM repair_orders WHERE id = ${repairOrderId}`
    })

    revalidatePath("/repair-orders")
    if (customerId) {
      revalidatePath(`/customers/${customerId}`)
    }
    revalidatePath("/appointments")
    revalidatePath("/invoices")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting repair order:", error)

    if (error instanceof Error && error.message === "Repair order not found") {
      return {
        success: false,
        error: "Repair order not found",
      }
    }

    return {
      success: false,
      error: "Failed to delete repair order",
    }
  }
}
