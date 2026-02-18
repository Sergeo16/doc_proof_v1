"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createToken,
  setSessionCookie,
  clearSession,
} from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, "Password must contain uppercase"),
  name: z.string().min(2).optional(),
});

export async function login(formData: FormData) {
  const data = loginSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email: data.email },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Can't reach database") || msg.includes("5432")) {
      throw new Error(
        "Base de données indisponible. Lancez: npm run docker:dev"
      );
    }
    throw err;
  }

  if (!user || user.status === "SUSPENDED") {
    throw new Error("Invalid credentials");
  }

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const token = await createToken(user);
  await setSessionCookie(token);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createAuditLog({
    userId: user.id,
    action: "LOGIN",
    resource: "user",
    resourceId: user.id,
  });

  revalidatePath("/", "layout");
  const locale = (formData.get("locale") as string) || "en";
  redirect(`/${locale}/dashboard`);
}

export async function register(formData: FormData) {
  const data = registerSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  });

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      role: "USER",
    },
  });

  await createAuditLog({
    userId: user.id,
    action: "REGISTER",
    resource: "user",
    resourceId: user.id,
  });

  const token = await createToken(user);
  await setSessionCookie(token);
  revalidatePath("/", "layout");
  const locale = (formData.get("locale") as string) || "en";
  redirect(`/${locale}/dashboard`);
}

export async function logout(formData: FormData) {
  await clearSession();
  revalidatePath("/", "layout");
  const locale = (formData.get("locale") as string) || "en";
  redirect(`/${locale}`);
}
