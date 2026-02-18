/**
 * DOC PROOF - Authentication & Authorization
 * JWT, RBAC, Session management
 */

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./db";
import type { Role } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "doc-proof-default-secret-change-in-production"
);
const TOKEN_EXPIRY = "7d";
const COOKIE_NAME = "doc_proof_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(user: {
  id: string;
  email: string;
  role: Role;
}) {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { sub: string; email: string; role: Role };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { organization: true },
    });
    if (!user || user.status === "SUSPENDED") return null;
    return user;
  } catch {
    return null; // DB unavailable - app continues without session
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function hasRole(userRole: Role, required: Role[]): boolean {
  const hierarchy: Record<Role, number> = {
    SUPER_ADMIN: 4,
    ORG_ADMIN: 3,
    VERIFIER: 2,
    USER: 1,
  };
  return required.some((r) => hierarchy[userRole] >= hierarchy[r]);
}

export function requireRole(required: Role[]) {
  return async () => {
    const session = await getSession();
    if (!session) throw new Error("UNAUTHORIZED");
    if (!hasRole(session.role, required)) throw new Error("FORBIDDEN");
    return session;
  };
}
