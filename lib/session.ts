import { SignJWT, jwtVerify, type JWTPayload } from "jose"

const SESSION_COOKIE = "studysprint_admin"
const encoder = new TextEncoder()
function getSecret() {
  // In production, set JWT_SECRET in Project Settings. For dev/preview, fall back to a static secret.
  const secret = process.env.JWT_SECRET || "dev-insecure-secret-change-me"
  return encoder.encode(secret)
}

export type AdminSession = {
  email: string
  role: "admin"
}

export async function createSession(payload: AdminSession, maxAgeSec = 60 * 60 * 24 * 7) {
  const token = await new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(getSecret())
  return token
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    const { email, role } = payload as unknown as AdminSession
    if (role !== "admin" || !email) return null
    return { email, role: "admin" }
  } catch {
    return null
  }
}

export { SESSION_COOKIE }
