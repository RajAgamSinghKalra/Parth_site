import bcrypt from "bcryptjs"

export async function verifyPassword({
  providedPassword,
  envPassword,
  envPasswordHash,
}: {
  providedPassword: string
  envPassword?: string
  envPasswordHash?: string
}): Promise<boolean> {
  if (envPasswordHash && envPasswordHash.length > 0) {
    try {
      return await bcrypt.compare(providedPassword, envPasswordHash)
    } catch {
      return false
    }
  }
  if (envPassword && envPassword.length > 0) {
    return providedPassword === envPassword
  }
  return false
}
