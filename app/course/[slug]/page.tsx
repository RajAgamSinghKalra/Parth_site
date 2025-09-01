import Link from "next/link"
import { notFound } from "next/navigation"
import { PageTracker } from "@/components/tracking/page-tracker"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const course = await prisma.course.findFirst({
    where: { slug },
    include: { subjects: { orderBy: { name: "asc" } }, college: true },
  })
  if (!course) return notFound()

  return (
    <div className="space-y-6">
      <PageTracker title={course.name} href={`/course/${course.slug}`} type="nav" />
      <header className="space-y-1">
        <h1 className="font-serif text-2xl font-semibold">{course.name}</h1>
        <p className="text-sm text-muted-foreground">Select a subject to see materials, PYQs, and videos.</p>
      </header>

      <section aria-labelledby="subjects" className="space-y-2">
        <h2 id="subjects" className="font-serif text-xl font-semibold">
          Subjects
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {course.subjects.length ? (
            course.subjects.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/subject/${s.slug}`}
                  className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-muted"
                >
                  {s.name}
                </Link>
              </li>
            ))
          ) : (
            <li className="col-span-full text-sm text-muted-foreground">No subjects found.</li>
          )}
        </ul>
      </section>
    </div>
  )
}
