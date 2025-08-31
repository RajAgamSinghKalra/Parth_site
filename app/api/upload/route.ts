import { NextResponse } from "next/server"
import { storage } from "@/lib/storage"
import { requireAdmin } from "@/lib/auth-api"

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  const file = form.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 })

  const bytes = new Uint8Array(await file.arrayBuffer())
  const uploaded = await storage.upload({ filename: file.name, data: bytes, contentType: file.type })
  return NextResponse.json({ ok: true, file: uploaded })
}
