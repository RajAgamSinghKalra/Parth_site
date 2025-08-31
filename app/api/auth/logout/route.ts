import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SESSION_COOKIE } from "@/lib/session"

export async function POST() {
  const secure = process.env.NODE_ENV === "production"

  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return NextResponse.json({ ok: true })
}
