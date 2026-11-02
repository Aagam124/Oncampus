import AdminAuditLog from '../models/AdminAuditLog.js';

/**
 * Record an administrative action into the audit trail.
 * @param {Object} params
 * @param {ObjectId|string} params.admin - Admin user ID
 * @param {string} params.action - Action name (e.g., 'USER_SUSPENDED', 'SERVICE_HIDDEN')
 * @param {string} params.entityType - 'User' | 'Service' | 'Project' | 'Order' | 'Report' | 'Announcement' | 'Setting' | 'Dispute'
 * @param {string|ObjectId} params.entityId - ID of the entity affected
 * @param {string} [params.entityTitle] - Human-readable title or name
 * @param {any} [params.previousState] - Previous state/values
 * @param {any} [params.newState] - New state/values
 * @param {string} [params.reason] - Justification or notes
 * @param {Object} [params.req] - Express request object for IP and User-Agent
 */
export const recordAuditLog = async ({
  admin,
  action,
  entityType,
  entityId,
  entityTitle = '',
  previousState = null,
  newState = null,
  reason = '',
  req = null,
}) => {
  try {
    const ipAddress = req?.ip || req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || '';
    const userAgent = req?.headers?.['user-agent'] || '';

    await AdminAuditLog.create({
      admin,
      action,
      entityType,
      entityId: String(entityId),
      entityTitle,
      previousState,
      newState,
      reason,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error('Failed to create audit log entry:', err.message);
  }
};
