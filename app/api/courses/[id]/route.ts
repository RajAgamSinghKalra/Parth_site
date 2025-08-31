import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-api"
import { z } from "zod"
import { slugify } from "@/lib/slug"

const schema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  collegeId: z.string().min(1).optional(),
})

export async function PATCH(_req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const json = await _req.json().catch(() => ({}))
  const parsed = schema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  const data: any = { ...parsed.data }
  if (data.name && !data.slug) data.slug = slugify(data.name)
  const updated = await prisma.course.update({ where: { id: ctx.params.id }, data })
  return NextResponse.json({ item: updated })
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await prisma.course.delete({ where: { id: ctx.params.id } })
  return NextResponse.json({ ok: true })
}
