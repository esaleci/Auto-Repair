import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Initialize the SQL client with the database URL
export const sql = neon(process.env.DATABASE_URL!)

// Initialize the Drizzle ORM instance
export const db = drizzle(sql)

// Helper function to execute a transaction
export async function executeTransaction<T>(callback: (tx: typeof db) => Promise<T>): Promise<T> {
  try {
    // Start a transaction
    await sql`BEGIN`

    // Execute the callback with the transaction
    const result = await callback(db)

    // Commit the transaction
    await sql`COMMIT`

    return result
  } catch (error) {
    // Rollback the transaction on error
    await sql`ROLLBACK`
    console.error("Transaction failed:", error)
    throw error
  }
}
