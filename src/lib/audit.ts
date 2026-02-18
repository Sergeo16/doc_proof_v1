/**
 * DOC PROOF - Audit Logging
 * GDPR-compliant audit trail
 */

import { prisma } from "./db";

export async function createAuditLog(params: {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}) {
  return prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      metadata: params.metadata as object,
      ipAddress: params.ipAddress,
    },
  });
}
