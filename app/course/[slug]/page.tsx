import Link from "next/link"
import { PageTracker } from "@/components/tracking/page-tracker"

export default function CoursePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const name = slugToTitle(slug)

  return (
    <div className="space-y-6">
      <PageTracker title={name} href={`/course/${slug}`} type="nav" />
      <header className="space-y-1">
        <h1 className="font-serif text-2xl font-semibold">{name}</h1>
        <p className="text-sm text-muted-foreground">Select a subject to see materials, PYQs, and videos.</p>
      </header>

      <section aria-labelledby="subjects" className="space-y-2">
        <h2 id="subjects" className="font-serif text-xl font-semibold">
          Subjects
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {["discrete-math", "data-structures", "operating-systems"].map((s) => (
            <li key={s}>
              <Link
                href={`/subject/${s}`}
                className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-muted"
              >
                {slugToTitle(s)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function slugToTitle(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
}
