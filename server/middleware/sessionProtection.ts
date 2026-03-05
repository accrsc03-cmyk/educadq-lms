import { Request } from "express";
import { getActiveSessions, deactivateSession, createSession } from "../db";

/**
 * Generate a device hash based on user agent and other browser characteristics
 */
export function generateDeviceHash(userAgent?: string): string {
  if (!userAgent) return "unknown";
  
  // Simple hash of user agent - in production, use more sophisticated fingerprinting
  let hash = 0;
  for (let i = 0; i < userAgent.length; i++) {
    const char = userAgent.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Extract IP address from request
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

/**
 * Check for suspicious activity (multiple IPs/devices)
 */
export async function checkSessionSuspicion(
  userId: number,
  currentIp: string,
  currentDeviceHash: string
): Promise<{
  isSuspicious: boolean;
  reason?: string;
  activeSessions: number;
}> {
  const activeSessions = await getActiveSessions(userId);
  
  if (activeSessions.length === 0) {
    return { isSuspicious: false, activeSessions: 0 };
  }

  // Check for multiple IPs
  const ips = new Set(activeSessions.map((s) => s.ipAddress).filter(Boolean));
  if (ips.size > 1 && !ips.has(currentIp)) {
    return {
      isSuspicious: true,
      reason: "Multiple IPs detected",
      activeSessions: activeSessions.length,
    };
  }

  // Check for multiple devices
  const devices = new Set(activeSessions.map((s) => s.deviceId).filter(Boolean));
  if (devices.size > 1 && !devices.has(currentDeviceHash)) {
    return {
      isSuspicious: true,
      reason: "Multiple devices detected",
      activeSessions: activeSessions.length,
    };
  }

  return { isSuspicious: false, activeSessions: activeSessions.length };
}

/**
 * Handle session creation with anti-sharing protection
 */
export async function createProtectedSession(
  userId: number,
  req: Request
): Promise<{
  sessionCreated: boolean;
  isSuspicious: boolean;
  reason?: string;
}> {
  const clientIp = getClientIp(req);
  const deviceHash = generateDeviceHash(req.headers["user-agent"]);
  const userAgent = req.headers["user-agent"] as string;

  // Check for suspicious activity
  const suspicion = await checkSessionSuspicion(userId, clientIp, deviceHash);

  if (suspicion.isSuspicious) {
    // In production, you might want to:
    // 1. Send an alert to the user
    // 2. Require additional verification
    // 3. Deactivate other sessions
    
    console.warn(
      `[Security] Suspicious login detected for user ${userId}: ${suspicion.reason}`
    );

    // Optionally deactivate other sessions
    const activeSessions = await getActiveSessions(userId);
    for (const session of activeSessions) {
      await deactivateSession(session.id);
    }
  }

  // Create new session
  await createSession({
    userId,
    ipAddress: clientIp,
    deviceId: deviceHash,
    userAgent,
  });

  return {
    sessionCreated: true,
    isSuspicious: suspicion.isSuspicious,
    reason: suspicion.reason,
  };
}

/**
 * Validate session on each request
 */
export async function validateSession(
  userId: number,
  req: Request
): Promise<{
  isValid: boolean;
  reason?: string;
}> {
  const activeSessions = await getActiveSessions(userId);
  
  if (activeSessions.length === 0) {
    return { isValid: false, reason: "No active sessions" };
  }

  const clientIp = getClientIp(req);
  const deviceHash = generateDeviceHash(req.headers["user-agent"]);

  // Check if current IP/device matches any active session
  const validSession = activeSessions.some(
    (s) => s.ipAddress === clientIp || s.deviceId === deviceHash
  );

  if (!validSession) {
    return {
      isValid: false,
      reason: "Session IP/device mismatch",
    };
  }

  return { isValid: true };
}
