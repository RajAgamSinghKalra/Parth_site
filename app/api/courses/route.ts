import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getPagination } from "@/lib/pagination"
import { requireAdmin } from "@/lib/auth-api"
import { slugify } from "@/lib/slug"
import { z } from "zod"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const { page, pageSize, q } = getPagination(url.searchParams)
  const collegeId = url.searchParams.get("collegeId") || undefined
  const where: any = {}
  if (collegeId) where.collegeId = collegeId
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }]

  const [items, total] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { college: true },
    }),
    prisma.course.count({ where }),
  ])
  return NextResponse.json({ items, total, page, pageSize })
}

const upsertSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  collegeId: z.string().min(1),
})

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const json = await req.json().catch(() => ({}))
  const parsed = upsertSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  const { name, slug, collegeId } = parsed.data
  const finalSlug = (slug && slug.trim()) || slugify(name)
  const created = await prisma.course.create({ data: { name, slug: finalSlug, collegeId } })
  return NextResponse.json({ item: created })
}
