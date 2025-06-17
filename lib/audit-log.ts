import { sql } from "@/lib/db"

export enum AuditLogAction {
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",
  USER_CREATED = "user_created",
  USER_UPDATED = "user_updated",
  USER_DELETED = "user_deleted",
  TRANSACTION_CREATED = "transaction_created",
  TRANSACTION_APPROVED = "transaction_approved",
  TRANSACTION_REJECTED = "transaction_rejected",
  LISTING_CREATED = "listing_created",
  LISTING_UPDATED = "listing_updated",
  LISTING_DELETED = "listing_deleted",
  ORDER_CREATED = "order_created",
  ORDER_UPDATED = "order_updated",
  ADMIN_ACTION = "admin_action",
  SYSTEM_CONFIG_CHANGED = "system_config_changed",
}

interface AuditLogEntry {
  userId?: number
  action: AuditLogAction
  resourceType?: string
  resourceId?: number
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog({
  userId,
  action,
  resourceType,
  resourceId,
  details = {},
  ipAddress,
  userAgent,
}: AuditLogEntry): Promise<void> {
  try {
    // Only log if database is available
    if (!process.env.DATABASE_URL) {
      console.log("Audit log (demo mode):", { action, userId, resourceType, resourceId })
      return
    }

    await sql`
      INSERT INTO audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        details,
        ip_address,
        user_agent,
        created_at
      ) VALUES (
        ${userId || null},
        ${action},
        ${resourceType || null},
        ${resourceId || null},
        ${JSON.stringify(details)},
        ${ipAddress || null},
        ${userAgent || null},
        NOW()
      )
    `
  } catch (error) {
    console.error("Failed to create audit log:", error)
    // Don't throw error to avoid breaking the main operation
  }
}

// Helper function to get audit logs
export async function getAuditLogs(limit = 50, offset = 0, userId?: number, action?: AuditLogAction) {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    let query = sql`
      SELECT 
        al.*,
        u.name as user_name,
        u.email as user_email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `

    if (userId) {
      query = sql`${query} AND al.user_id = ${userId}`
    }

    if (action) {
      query = sql`${query} AND al.action = ${action}`
    }

    query = sql`${query} ORDER BY al.created_at DESC LIMIT ${limit} OFFSET ${offset}`

    return await query
  } catch (error) {
    console.error("Failed to get audit logs:", error)
    return []
  }
}

// Helper function to create audit log for user actions
export async function auditUserAction(
  userId: number,
  action: AuditLogAction,
  details?: Record<string, any>,
  request?: Request,
) {
  const ipAddress = request?.headers.get("x-forwarded-for") || request?.headers.get("x-real-ip") || "unknown"

  const userAgent = request?.headers.get("user-agent") || "unknown"

  await createAuditLog({
    userId,
    action,
    details,
    ipAddress,
    userAgent,
  })
}

// Helper function to create audit log for admin actions
export async function auditAdminAction(
  adminUserId: number,
  action: AuditLogAction,
  resourceType: string,
  resourceId: number,
  details?: Record<string, any>,
  request?: Request,
) {
  const ipAddress = request?.headers.get("x-forwarded-for") || request?.headers.get("x-real-ip") || "unknown"

  const userAgent = request?.headers.get("user-agent") || "unknown"

  await createAuditLog({
    userId: adminUserId,
    action,
    resourceType,
    resourceId,
    details,
    ipAddress,
    userAgent,
  })
}
