import Link from "next/link"
import { notFound } from "next/navigation"
import { noStore } from "next/cache"
import { PageTracker } from "@/components/tracking/page-tracker"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default async function CollegePage({ params }: { params: { slug: string } }) {
  noStore()
  const { slug } = params
  const college = await prisma.college.findUnique({
    where: { slug },
    include: { courses: { orderBy: { name: "asc" } } },
  })
  if (!college) return notFound()

  return (
    <div className="space-y-6">
      <PageTracker title={college.name} href={`/college/${college.slug}`} type="nav" />
      <header className="space-y-1">
        <h1 className="font-serif text-2xl font-semibold">{college.name}</h1>
        <p className="text-sm text-muted-foreground">
          Browse courses and subjects from {college.name}.
        </p>
      </header>

      <section aria-labelledby="courses" className="space-y-2">
        <h2 id="courses" className="font-serif text-xl font-semibold">
          Courses
        </h2>
        {college.courses.length > 0 ? (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {college.courses.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/course/${c.slug}`}
                  className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-muted"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No courses found.</p>
        )}
      </section>
    </div>
  )
}
