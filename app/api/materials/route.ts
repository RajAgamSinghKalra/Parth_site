import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getPagination } from "@/lib/pagination"
import { requireAdmin } from "@/lib/auth-api"
import { z } from "zod"

const MaterialTypeEnum = z.enum(["NOTES", "SYLLABUS", "GUIDE", "ASSIGNMENT", "PPT", "OTHER"])

const upsertSchema = z.object({
  subjectId: z.string().min(1),
  type: MaterialTypeEnum,
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  fileUrl: z.string().url().optional().nullable(),
  externalUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear()).optional().nullable(),
  author: z.string().optional().nullable(),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const { page, pageSize, q } = getPagination(url.searchParams)
  const subjectId = url.searchParams.get("subjectId") || undefined
  const type = url.searchParams.get("type") || undefined

  const where: any = {}
  if (subjectId) where.subjectId = subjectId
  if (type) where.type = type
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { tags: { has: q } },
    ]
  }

  const [items, total] = await Promise.all([
    prisma.material.findMany({
      where,
      include: { subject: { include: { course: { include: { college: true } } } } },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.material.count({ where }),
  ])

  return NextResponse.json({ items, total, page, pageSize })
}

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const json = await req.json().catch(() => ({}))
  const parsed = upsertSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const created = await prisma.material.create({ data: parsed.data })
  return NextResponse.json({ item: created })
}
