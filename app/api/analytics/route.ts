import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const locationId = searchParams.get("locationId")

    // Default date range to last 30 days if not provided
    const defaultStartDate = new Date()
    defaultStartDate.setDate(defaultStartDate.getDate() - 30)

    const start = startDate ? new Date(startDate) : defaultStartDate
    const end = endDate ? new Date(endDate) : new Date()

    let result

    switch (type) {
      case "revenue":
        // Revenue analytics
        result = await getRevenueAnalytics(start, end, locationId)
        break

      case "repairs":
        // Repair order analytics
        result = await getRepairAnalytics(start, end, locationId)
        break

      case "inventory":
        // Inventory analytics
        result = await getInventoryAnalytics(locationId)
        break

      case "customers":
        // Customer analytics
        result = await getCustomerAnalytics(start, end, locationId)
        break

      case "dashboard":
      default:
        // Dashboard overview analytics
        result = await getDashboardAnalytics(locationId)
        break
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

// Helper function to get revenue analytics
async function getRevenueAnalytics(startDate: Date, endDate: Date, locationId?: string | null) {
  let query = `
    SELECT 
      DATE_TRUNC('day', i.created_at) as date,
      SUM(i.total) as revenue
    FROM invoices i
    JOIN repair_orders ro ON i.repair_order_id = ro.id
  `

  const queryParams: any[] = [startDate, endDate]
  const conditions = [`i.created_at BETWEEN $1 AND $2`]

  if (locationId) {
    conditions.push(`ro.location_id = $3`)
    queryParams.push(locationId)
  }

  query += ` WHERE ${conditions.join(" AND ")}`
  query += ` GROUP BY DATE_TRUNC('day', i.created_at)`
  query += ` ORDER BY date`

  const dailyRevenue = await sql.query(query, queryParams)

  // Get total revenue
  let totalQuery = `
    SELECT SUM(i.total) as total_revenue
    FROM invoices i
    JOIN repair_orders ro ON i.repair_order_id = ro.id
  `

  totalQuery += ` WHERE ${conditions.join(" AND ")}`

  const totalRevenue = await sql.query(totalQuery, queryParams)

  // Get revenue by payment method
  let paymentMethodQuery = `
    SELECT 
      p.method,
      SUM(p.amount) as amount
    FROM payments p
    JOIN invoices i ON p.invoice_id = i.id
    JOIN repair_orders ro ON i.repair_order_id = ro.id
  `

  paymentMethodQuery += ` WHERE ${conditions.join(" AND ")}`
  paymentMethodQuery += ` GROUP BY p.method`

  const paymentMethods = await sql.query(paymentMethodQuery, queryParams)

  return {
    dailyRevenue,
    totalRevenue: totalRevenue[0]?.total_revenue || 0,
    paymentMethods,
  }
}

// Helper function to get repair analytics
async function getRepairAnalytics(startDate: Date, endDate: Date, locationId?: string | null) {
  let query = `
    SELECT 
      ro.status,
      COUNT(*) as count
    FROM repair_orders ro
  `

  const queryParams: any[] = [startDate, endDate]
  const conditions = [`ro.created_at BETWEEN $1 AND $2`]

  if (locationId) {
    conditions.push(`ro.location_id = $3`)
    queryParams.push(locationId)
  }

  query += ` WHERE ${conditions.join(" AND ")}`
  query += ` GROUP BY ro.status`

  const statusCounts = await sql.query(query, queryParams)

  // Get average repair time
  let timeQuery = `
    SELECT 
      AVG(EXTRACT(EPOCH FROM (ro.end_date - ro.start_date)) / 3600) as avg_hours
    FROM repair_orders ro
    WHERE ro.end_date IS NOT NULL
  `

  const timeConditions = [`ro.created_at BETWEEN $1 AND $2`]

  if (locationId) {
    timeConditions.push(`ro.location_id = $3`)
  }

  timeQuery += ` AND ${timeConditions.join(" AND ")}`

  const avgTime = await sql.query(timeQuery, queryParams)

  // Get repairs by location
  let locationQuery = `
    SELECT 
      l.name as location_name,
      COUNT(*) as count
    FROM repair_orders ro
    JOIN locations l ON ro.location_id = l.id
  `

  locationQuery += ` WHERE ${conditions.join(" AND ")}`
  locationQuery += ` GROUP BY l.name`

  const locationCounts = await sql.query(locationQuery, queryParams)

  return {
    statusCounts,
    avgRepairTime: avgTime[0]?.avg_hours || 0,
    locationCounts,
  }
}

// Helper function to get inventory analytics
async function getInventoryAnalytics(locationId?: string | null) {
  let query = `
    SELECT 
      COUNT(*) as total_items,
      SUM(quantity) as total_quantity,
      SUM(price * quantity) as total_value,
      COUNT(*) FILTER (WHERE quantity < 20) as low_stock_count
    FROM inventory_items
  `

  if (locationId) {
    query += ` WHERE location_id = $1`
  }

  const inventorySummary = await sql.query(query, locationId ? [locationId] : [])

  // Get most used parts
  let partsQuery = `
    SELECT 
      i.name,
      i.part_number,
      SUM(pu.quantity) as usage_count
    FROM part_usage pu
    JOIN inventory_items i ON pu.inventory_item_id = i.id
  `

  if (locationId) {
    partsQuery += ` WHERE i.location_id = $1`
  }

  partsQuery += ` GROUP BY i.name, i.part_number`
  partsQuery += ` ORDER BY usage_count DESC`
  partsQuery += ` LIMIT 10`

  const mostUsedParts = await sql.query(partsQuery, locationId ? [locationId] : [])

  return {
    summary: inventorySummary[0],
    mostUsedParts,
  }
}

// Helper function to get customer analytics
async function getCustomerAnalytics(startDate: Date, endDate: Date, locationId?: string | null) {
  let query = `
    SELECT 
      COUNT(DISTINCT c.id) as total_customers,
      COUNT(DISTINCT c.id) FILTER (
        WHERE c.created_at BETWEEN $1 AND $2
      ) as new_customers
    FROM customers c
  `

  if (locationId) {
    query += ` WHERE c.location_id = $3`
  }

  const customerSummary = await sql.query(query, locationId ? [startDate, endDate, locationId] : [startDate, endDate])

  // Get top customers by revenue
  let topCustomersQuery = `
    SELECT 
      c.id,
      c.first_name,
      c.last_name,
      COUNT(ro.id) as repair_count,
      SUM(i.total) as total_spent
    FROM customers c
    JOIN repair_orders ro ON c.id = ro.customer_id
    JOIN invoices i ON ro.id = i.repair_order_id
    WHERE i.created_at BETWEEN $1 AND $2
  `

  if (locationId) {
    topCustomersQuery += ` AND c.location_id = $3`
  }

  topCustomersQuery += ` GROUP BY c.id, c.first_name, c.last_name`
  topCustomersQuery += ` ORDER BY total_spent DESC`
  topCustomersQuery += ` LIMIT 10`

  const topCustomers = await sql.query(
    topCustomersQuery,
    locationId ? [startDate, endDate, locationId] : [startDate, endDate],
  )

  return {
    summary: customerSummary[0],
    topCustomers,
  }
}

// Helper function to get dashboard analytics
async function getDashboardAnalytics(locationId?: string | null) {
  // Get repair order counts by status
  let repairQuery = `
    SELECT 
      status,
      COUNT(*) as count
    FROM repair_orders
  `

  if (locationId) {
    repairQuery += ` WHERE location_id = $1`
  }

  repairQuery += ` GROUP BY status`

  const repairCounts = await sql.query(repairQuery, locationId ? [locationId] : [])

  // Get today's appointments
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  let appointmentQuery = `
    SELECT 
      a.*,
      ro.order_number,
      c.first_name as customer_first_name,
      c.last_name as customer_last_name,
      v.make as vehicle_make,
      v.model as vehicle_model,
      v.year as vehicle_year
    FROM appointments a
    JOIN repair_orders ro ON a.repair_order_id = ro.id
    JOIN customers c ON ro.customer_id = c.id
    JOIN vehicles v ON ro.vehicle_id = v.id
    WHERE a.date BETWEEN $1 AND $2
  `

  if (locationId) {
    appointmentQuery += ` AND ro.location_id = $3`
  }

  appointmentQuery += ` ORDER BY a.date`

  const todayAppointments = await sql.query(
    appointmentQuery,
    locationId ? [today, tomorrow, locationId] : [today, tomorrow],
  )

  // Get recent repair orders
  let recentOrdersQuery = `
    SELECT 
      ro.*,
      c.first_name as customer_first_name,
      c.last_name as customer_last_name,
      v.make as vehicle_make,
      v.model as vehicle_model,
      v.year as vehicle_year,
      l.name as location_name
    FROM repair_orders ro
    JOIN customers c ON ro.customer_id = c.id
    JOIN vehicles v ON ro.vehicle_id = v.id
    JOIN locations l ON ro.location_id = l.id
  `

  if (locationId) {
    recentOrdersQuery += ` WHERE ro.location_id = $1`
  }

  recentOrdersQuery += ` ORDER BY ro.created_at DESC`
  recentOrdersQuery += ` LIMIT 5`

  const recentOrders = await sql.query(recentOrdersQuery, locationId ? [locationId] : [])

  // Get low stock inventory
  let inventoryQuery = `
    SELECT 
      i.*,
      l.name as location_name
    FROM inventory_items i
    JOIN locations l ON i.location_id = l.id
    WHERE i.quantity < 20
  `

  if (locationId) {
    inventoryQuery += ` AND i.location_id = $1`
  }

  inventoryQuery += ` ORDER BY i.quantity`
  inventoryQuery += ` LIMIT 5`

  const lowStockItems = await sql.query(inventoryQuery, locationId ? [locationId] : [])

  return {
    repairCounts,
    todayAppointments,
    recentOrders,
    lowStockItems,
  }
}
