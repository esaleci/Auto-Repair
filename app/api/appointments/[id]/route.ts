import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { date } = body

    // Validate required fields
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    // Update appointment using a transaction
    const result = await executeTransaction(async (tx) => {
      // Check if appointment exists
      const appointment = await sql`SELECT id FROM appointments WHERE id = ${id}`

      if (appointment.length === 0) {
        throw new Error("Appointment not found")
      }

      // Update appointment
      const updatedAppointment = await sql`
        UPDATE appointments
        SET 
          date = ${date},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      return updatedAppointment[0]
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating appointment:", error)

    if (error instanceof Error && error.message === "Appointment not found") {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Delete appointment using a transaction
    await executeTransaction(async (tx) => {
      // Check if appointment exists
      const appointment = await sql`SELECT id FROM appointments WHERE id = ${id}`

      if (appointment.length === 0) {
        throw new Error("Appointment not found")
      }

      // Delete the appointment
      await sql`DELETE FROM appointments WHERE id = ${id}`
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting appointment:", error)

    if (error instanceof Error && error.message === "Appointment not found") {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 })
  }
}
