import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-api"
import { slugify } from "@/lib/slug"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  code: z.string().optional().nullable(),
  semester: z.coerce.number().int().min(1).max(12).optional().nullable(),
  courseId: z.string().min(1).optional(),
})

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const json = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const data: any = { ...parsed.data }
  if (data.name && !data.slug) data.slug = slugify(data.name)

  const updated = await prisma.subject.update({ where: { id: ctx.params.id }, data })
  return NextResponse.json({ item: updated })
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.subject.delete({ where: { id: ctx.params.id } })
  return NextResponse.json({ ok: true })
}
