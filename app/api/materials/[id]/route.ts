import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-api"
import { z } from "zod"

const MaterialTypeEnum = z.enum(["NOTES", "SYLLABUS", "GUIDE", "ASSIGNMENT", "PPT", "OTHER"])

const patchSchema = z.object({
  subjectId: z.string().min(1).optional(),
  type: MaterialTypeEnum.optional(),
  title: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  fileUrl: z.string().url().optional().nullable(),
  externalUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear()).optional().nullable(),
  author: z.string().optional().nullable(),
})

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const json = await req.json().catch(() => ({}))
  const parsed = patchSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const updated = await prisma.material.update({ where: { id: ctx.params.id }, data: parsed.data })
  return NextResponse.json({ item: updated })
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.material.delete({ where: { id: ctx.params.id } })
  return NextResponse.json({ ok: true })
}
