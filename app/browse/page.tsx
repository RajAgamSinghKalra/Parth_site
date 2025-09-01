import Link from "next/link"
import { unstable_noStore as noStore } from "next/cache"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

type SearchParams = { by?: "college" | "course" | "subject" }

const tabs = [
  { key: "college", label: "By College", href: "/browse?by=college" },
  { key: "course", label: "By Course", href: "/browse?by=course" },
  { key: "subject", label: "By Subject", href: "/browse?by=subject" },
] as const

export default function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
  noStore()
  const active = (searchParams.by || "college") as SearchParams["by"]

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-serif text-2xl font-semibold">Browse</h1>
        <p className="text-sm text-muted-foreground">Find materials by college, course, or subject.</p>
      </header>

      <nav aria-label="Browse by" className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm",
              active === t.key
                ? "bg-primary text-primary-foreground border-transparent"
                : "border-input hover:bg-muted",
            )}
            aria-current={active === t.key ? "page" : undefined}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {active === "college" && <CollegeGrid />}
      {active === "course" && <CourseGrid />}
      {active === "subject" && <SubjectGrid />}
    </div>
  )
}

async function CollegeGrid() {
  noStore()
  const colleges = await prisma.college.findMany({ orderBy: { name: "asc" } })
  return (
    <section aria-labelledby="colleges" className="space-y-3">
      <h2 id="colleges" className="font-serif text-xl font-semibold">
        Colleges
      </h2>
      {colleges.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {colleges.map((c) => (
            <Link key={c.id} href={`/college/${c.slug}`} className="group">
              <Card className="transition-colors group-hover:border-foreground/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{c.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Explore courses and subjects</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No colleges found.</p>
      )}
    </section>
  )
}

async function CourseGrid() {
  noStore()
  const courses = await prisma.course.findMany({ orderBy: { name: "asc" } })
  return (
    <section aria-labelledby="courses" className="space-y-3">
      <h2 id="courses" className="font-serif text-xl font-semibold">
        Courses
      </h2>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link key={c.id} href={`/course/${c.slug}`} className="group">
              <Card className="transition-colors group-hover:border-foreground/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{c.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Browse subjects and materials</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No courses found.</p>
      )}
    </section>
  )
}

async function SubjectGrid() {
  noStore()
  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } })
  return (
    <section aria-labelledby="subjects" className="space-y-3">
      <h2 id="subjects" className="font-serif text-xl font-semibold">
        Subjects
      </h2>
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <Link key={s.id} href={`/subject/${s.slug}`} className="group">
              <Card className="transition-colors group-hover:border-foreground/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{s.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Notes, PYQs, and videos</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No subjects found.</p>
      )}
    </section>
  )
}
