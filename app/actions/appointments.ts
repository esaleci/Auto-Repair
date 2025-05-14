"use server"

import { sql, executeTransaction } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createAppointment(formData: FormData) {
  try {
    const date = formData.get("date") as string
    const repairOrderId = formData.get("repairOrderId") as string

    // Validate required fields
    if (!date || !repairOrderId) {
      return {
        success: false,
        error: "Date and repair order are required",
      }
    }

    // Create appointment using a transaction
    const result = await executeTransaction(async (tx) => {
      // Check if repair order exists
      const repairOrder = await sql`SELECT id FROM repair_orders WHERE id = ${repairOrderId}`

      if (repairOrder.length === 0) {
        throw new Error("Repair order not found")
      }

      // Check if appointment already exists for this repair order
      const existingAppointment = await sql`
        SELECT id FROM appointments WHERE repair_order_id = ${repairOrderId}
      `

      if (existingAppointment.length > 0) {
        throw new Error("Appointment already exists for this repair order")
      }

      // Create appointment
      const appointment = await sql`
        INSERT INTO appointments (
          date, repair_order_id, created_at, updated_at
        ) VALUES (
          ${date}, ${repairOrderId}, NOW(), NOW()
        )
        RETURNING *
      `

      return appointment[0]
    })

    revalidatePath("/appointments")
    revalidatePath(`/repair-orders/${result.repair_order_id}`)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error creating appointment:", error)

    if (error instanceof Error) {
      if (error.message === "Repair order not found") {
        return {
          success: false,
          error: "Repair order not found",
        }
      }
      if (error.message === "Appointment already exists for this repair order") {
        return {
          success: false,
          error: "Appointment already exists for this repair order",
        }
      }
    }

    return {
      success: false,
      error: "Failed to create appointment",
    }
  }
}

export async function updateAppointment(appointmentId: string, formData: FormData) {
  try {
    const date = formData.get("date") as string

    // Validate required fields
    if (!date) {
      return {
        success: false,
        error: "Date is required",
      }
    }

    // Update appointment using a transaction
    const result = await executeTransaction(async (tx) => {
      // Check if appointment exists
      const appointment = await sql`SELECT id, repair_order_id FROM appointments WHERE id = ${appointmentId}`

      if (appointment.length === 0) {
        throw new Error("Appointment not found")
      }

      // Update appointment
      const updatedAppointment = await sql`
        UPDATE appointments
        SET 
          date = ${date},
          updated_at = NOW()
        WHERE id = ${appointmentId}
        RETURNING *
      `

      return updatedAppointment[0]
    })

    revalidatePath("/appointments")
    revalidatePath(`/repair-orders/${result.repair_order_id}`)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error updating appointment:", error)

    if (error instanceof Error && error.message === "Appointment not found") {
      return {
        success: false,
        error: "Appointment not found",
      }
    }

    return {
      success: false,
      error: "Failed to update appointment",
    }
  }
}

export async function deleteAppointment(appointmentId: string) {
  try {
    let repairOrderId: string | null = null

    // Delete appointment using a transaction
    await executeTransaction(async (tx) => {
      // Check if appointment exists
      const appointment = await sql`SELECT id, repair_order_id FROM appointments WHERE id = ${appointmentId}`

      if (appointment.length === 0) {
        throw new Error("Appointment not found")
      }

      repairOrderId = appointment[0].repair_order_id

      // Delete the appointment
      await sql`DELETE FROM appointments WHERE id = ${appointmentId}`
    })

    revalidatePath("/appointments")
    if (repairOrderId) {
      revalidatePath(`/repair-orders/${repairOrderId}`)
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting appointment:", error)

    if (error instanceof Error && error.message === "Appointment not found") {
      return {
        success: false,
        error: "Appointment not found",
      }
    }

    return {
      success: false,
      error: "Failed to delete appointment",
    }
  }
}
