import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-api"
import { z } from "zod"
import { slugify } from "@/lib/slug"

const upsertSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(1).optional(),
  location: z.string().nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const json = await req.json().catch(() => ({}))
  const parsed = upsertSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  const data: any = { ...parsed.data }
  if (data.name && !data.slug) data.slug = slugify(data.name)

  const updated = await prisma.college.update({
    where: { id: params.id },
    data,
  })
  return NextResponse.json({ item: updated })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.college.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
