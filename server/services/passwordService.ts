/**
 * Password Service
 * Handles password hashing and verification
 */

import crypto from "crypto";

/**
 * Hash a password using PBKDF2
 * PBKDF2 is more suitable for Node.js without external dependencies
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, storedHash] = hash.split(":");

    if (!salt || !storedHash) {
      return false;
    }

    const computedHash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");

    return computedHash === storedHash;
  } catch (error) {
    console.error("[Password] Error verifying password:", error);
    return false;
  }
}

/**
 * Generate a random password
 */
export function generateRandomPassword(length: number = 16): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return password;
}

/**
 * Check password strength
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 20;
  } else {
    feedback.push("Senha deve ter pelo menos 8 caracteres");
  }

  if (password.length >= 12) {
    score += 10;
  }

  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push("Inclua letras minúsculas");
  }

  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push("Inclua letras maiúsculas");
  }

  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push("Inclua números");
  }

  if (/[!@#$%^&*]/.test(password)) {
    score += 15;
  } else {
    feedback.push("Inclua caracteres especiais");
  }

  if (password.length >= 16) {
    score += 10;
  }

  return {
    score: Math.min(100, score),
    feedback,
  };
}

/**
 * Generate a password reset token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Verify reset token (tokens expire after 1 hour)
 */
export function verifyResetToken(
  token: string,
  storedToken: string,
  createdAt: Date
): boolean {
  const now = new Date();
  const expiryTime = new Date(createdAt.getTime() + 60 * 60 * 1000); // 1 hour

  return token === storedToken && now < expiryTime;
}
