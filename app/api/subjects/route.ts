import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getPagination } from "@/lib/pagination"
import { requireAdmin } from "@/lib/auth-api"
import { slugify } from "@/lib/slug"
import { z } from "zod"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const { page, pageSize, q } = getPagination(url.searchParams)
  const courseId = url.searchParams.get("courseId") || undefined

  const where: any = {}
  if (courseId) where.courseId = courseId
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { code: { contains: q, mode: "insensitive" } },
    ]
  }

  const [items, total] = await Promise.all([
    prisma.subject.findMany({
      where,
      include: { course: { include: { college: true } } },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.subject.count({ where }),
  ])

  return NextResponse.json({ items, total, page, pageSize })
}

const upsertSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  code: z.string().optional().nullable(),
  semester: z.coerce.number().int().min(1).max(12).optional().nullable(),
  courseId: z.string().min(1),
})

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const json = await req.json().catch(() => ({}))
  const parsed = upsertSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const { name, slug, code, semester, courseId } = parsed.data
  const finalSlug = (slug && slug.trim()) || slugify(name)

  const created = await prisma.subject.create({
    data: { name, slug: finalSlug, code: code || null, semester: semester ?? null, courseId },
  })
  return NextResponse.json({ item: created })
}
