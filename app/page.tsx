import Link from "next/link"
import { FileText } from "lucide-react"
import { ContinueStudyingShelf } from "@/components/user-state"

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="mt-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-balance text-4xl font-semibold md:text-5xl">
            Find the right study material—fast.
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Browse by college, course, or subject. Materials, PYQs, and videos at your fingertips.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/browse?by=college"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Browse by College
            </Link>
            <Link
              href="/browse?by=course"
              className="rounded-full border border-input px-4 py-2 text-sm hover:bg-muted"
            >
              Browse by Course
            </Link>
            <Link
              href="/browse?by=subject"
              className="rounded-full border border-input px-4 py-2 text-sm hover:bg-muted"
            >
              Browse by Subject
            </Link>
            <Link href="/resources" className="rounded-full border border-input px-4 py-2 text-sm hover:bg-muted">
              View Resources
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="continue-studying" className="space-y-3">
        <h2 id="continue-studying" className="font-serif text-xl font-semibold">
          Continue Studying
        </h2>
        <ContinueStudyingShelf />
      </section>

      <section aria-labelledby="recently-added" className="space-y-3">
        <h2 id="recently-added" className="font-serif text-xl font-semibold">
          Recently Added
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <article key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-medium">Material Title #{i}</span>
                <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">Notes</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Subject • Year • Tags</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
