"use server"

import { sql, executeTransaction } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createInventoryItem(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const partNumber = formData.get("partNumber") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const locationId = formData.get("locationId") as string

    // Validate required fields
    if (!name || !partNumber || isNaN(price) || isNaN(quantity) || !locationId) {
      return {
        success: false,
        error: "Name, part number, price, quantity, and location are required",
      }
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

    revalidatePath("/inventory")

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return {
      success: false,
      error: "Failed to create inventory item",
    }
  }
}

export async function updateInventoryItem(itemId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const partNumber = formData.get("partNumber") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const locationId = formData.get("locationId") as string

    // Validate required fields
    if (!name || !partNumber || isNaN(price) || isNaN(quantity) || !locationId) {
      return {
        success: false,
        error: "Name, part number, price, quantity, and location are required",
      }
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
        WHERE id = ${itemId}
        RETURNING *
      `

      if (item.length === 0) {
        throw new Error("Inventory item not found")
      }

      return item[0]
    })

    revalidatePath(`/inventory/${itemId}`)
    revalidatePath("/inventory")

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error updating inventory item:", error)

    if (error instanceof Error && error.message === "Inventory item not found") {
      return {
        success: false,
        error: "Inventory item not found",
      }
    }

    return {
      success: false,
      error: "Failed to update inventory item",
    }
  }
}

export async function deleteInventoryItem(itemId: string) {
  try {
    // Delete inventory item using a transaction
    await executeTransaction(async (tx) => {
      // Check if inventory item exists
      const item = await sql`SELECT id FROM inventory_items WHERE id = ${itemId}`

      if (item.length === 0) {
        throw new Error("Inventory item not found")
      }

      // Check if item is used in any repair orders
      const usageCount = await sql`
        SELECT COUNT(*) FROM part_usage WHERE inventory_item_id = ${itemId}
      `

      if (Number.parseInt(usageCount[0].count) > 0) {
        throw new Error("Cannot delete item that is used in repair orders")
      }

      // Delete the inventory item
      await sql`DELETE FROM inventory_items WHERE id = ${itemId}`
    })

    revalidatePath("/inventory")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting inventory item:", error)

    if (error instanceof Error) {
      if (error.message === "Inventory item not found") {
        return {
          success: false,
          error: "Inventory item not found",
        }
      }
      if (error.message === "Cannot delete item that is used in repair orders") {
        return {
          success: false,
          error: "Cannot delete item that is used in repair orders",
        }
      }
    }

    return {
      success: false,
      error: "Failed to delete inventory item",
    }
  }
}
