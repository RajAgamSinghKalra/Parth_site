import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { z } from "zod"
import { createSession, SESSION_COOKIE } from "@/lib/session"
import { verifyPassword } from "@/lib/password"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean().optional().default(true),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }
  const { email, password, remember } = parsed.data

  const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "password"
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const ok = await verifyPassword({
    providedPassword: password,
    envPassword: adminPassword,
    envPasswordHash: adminPasswordHash,
  })

  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  // Optional: ensure AdminUser exists for auditability
  try {
    const { prisma } = await import("@/lib/prisma")
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: {},
      create: { email: adminEmail, passwordHash: adminPasswordHash || "env", role: "admin" },
    })
  } catch {
    // ignore if prisma not initialized yet, or schema mismatch
  }

  const maxAgeSec = remember ? 60 * 60 * 24 * 7 : 60 * 60 * 8
  const token = await createSession({ email: adminEmail, role: "admin" }, maxAgeSec)

  const secure = process.env.NODE_ENV === "production"

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSec,
  })

  return NextResponse.json({ ok: true })
}
