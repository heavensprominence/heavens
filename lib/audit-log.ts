import { db } from "./db"

export enum AuditLogAction {
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",
  USER_SIGNUP = "user_signup",
  USER_UPDATE = "user_update",
  USER_DELETE = "user_delete",
  CRED_MINT = "cred_mint",
  CRED_BURN = "cred_burn",
  TRANSACTION_CREATE = "transaction_create",
  TRANSACTION_APPROVE = "transaction_approve",
  TRANSACTION_REJECT = "transaction_reject",
  LISTING_CREATE = "listing_create",
  LISTING_UPDATE = "listing_update",
  LISTING_DELETE = "listing_delete",
  ORDER_CREATE = "order_create",
  ORDER_UPDATE = "order_update",
  ADMIN_ACTION = "admin_action",
}

export async function createAuditLog(
  action: AuditLogAction,
  userId: string,
  details: Record<string, any> = {},
  targetId?: string,
  targetType?: string,
) {
  try {
    await db.query(
      `INSERT INTO audit_logs (action, user_id, target_id, target_type, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        action,
        userId,
        targetId || null,
        targetType || null,
        JSON.stringify(details),
        details.ipAddress || null,
        details.userAgent || null,
      ],
    )
  } catch (error) {
    console.error("Failed to create audit log:", error)
  }
}
