import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getPagination } from "@/lib/pagination"
import { requireAdmin } from "@/lib/auth-api"
import { z } from "zod"
import { slugify } from "@/lib/slug"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const { page, pageSize, q } = getPagination(url.searchParams)
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } },
        ],
      }
    : {}
  const [items, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.college.count({ where }),
  ])
  return NextResponse.json({ items, total, page, pageSize })
}

const upsertSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(1).optional(),
  location: z.string().nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
})

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const json = await req.json().catch(() => ({}))
  const parsed = upsertSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  const { name, slug, location, logoUrl } = parsed.data
  const finalSlug = (slug && slug.trim()) || slugify(name)
  const created = await prisma.college.create({
    data: { name, slug: finalSlug, location: location || null, logoUrl: logoUrl || null },
  })
  return NextResponse.json({ item: created })
}
