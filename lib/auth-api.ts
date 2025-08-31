import { cookies } from "next/headers"
import { SESSION_COOKIE, verifySession } from "@/lib/session"

export async function requireAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null
  const session = await verifySession(token)
  return session
}
