"use server"

import { sql, executeTransaction } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createCustomer(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const locationId = formData.get("locationId") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !locationId) {
      return {
        success: false,
        error: "First name, last name, email, and location are required",
      }
    }

    // Create customer using a transaction
    const result = await executeTransaction(async (tx) => {
      const customer = await sql`
        INSERT INTO customers (
          first_name, last_name, email, phone, address, location_id, created_at, updated_at
        ) VALUES (
          ${firstName}, ${lastName}, ${email}, ${phone}, ${address}, ${locationId}, NOW(), NOW()
        )
        RETURNING *
      `

      return customer[0]
    })

    revalidatePath("/customers")

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error creating customer:", error)
    return {
      success: false,
      error: "Failed to create customer",
    }
  }
}

export async function updateCustomer(customerId: string, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const locationId = formData.get("locationId") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !locationId) {
      return {
        success: false,
        error: "First name, last name, email, and location are required",
      }
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
        WHERE id = ${customerId}
        RETURNING *
      `

      if (customer.length === 0) {
        throw new Error("Customer not found")
      }

      return customer[0]
    })

    revalidatePath(`/customers/${customerId}`)
    revalidatePath("/customers")

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error updating customer:", error)

    if (error instanceof Error && error.message === "Customer not found") {
      return {
        success: false,
        error: "Customer not found",
      }
    }

    return {
      success: false,
      error: "Failed to update customer",
    }
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    // Delete customer using a transaction
    await executeTransaction(async (tx) => {
      // Check if customer exists
      const customer = await sql`SELECT id FROM customers WHERE id = ${customerId}`

      if (customer.length === 0) {
        throw new Error("Customer not found")
      }

      // Delete related records first
      await sql`DELETE FROM vehicles WHERE customer_id = ${customerId}`
      await sql`DELETE FROM repair_orders WHERE customer_id = ${customerId}`

      // Delete the customer
      await sql`DELETE FROM customers WHERE id = ${customerId}`
    })

    revalidatePath("/customers")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting customer:", error)

    if (error instanceof Error && error.message === "Customer not found") {
      return {
        success: false,
        error: "Customer not found",
      }
    }

    return {
      success: false,
      error: "Failed to delete customer",
    }
  }
}
