import Link from "next/link"
import { PageTracker } from "@/components/tracking/page-tracker"

export default function CollegePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const name = slugToTitle(slug)

  return (
    <div className="space-y-6">
      <PageTracker title={name} href={`/college/${slug}`} type="nav" />
      <header className="space-y-1">
        <h1 className="font-serif text-2xl font-semibold">{name}</h1>
        <p className="text-sm text-muted-foreground">Browse courses and subjects from {name}.</p>
      </header>

      <section aria-labelledby="courses" className="space-y-2">
        <h2 id="courses" className="font-serif text-xl font-semibold">
          Courses
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {["btech-cse", "bsc-physics", "mba-core"].map((c) => (
            <li key={c}>
              <Link
                href={`/course/${c}`}
                className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-muted"
              >
                {slugToTitle(c)}
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
