import { FileText, HelpCircle, PlayCircle } from "lucide-react"
import Link from "next/link" // use internal viewers
import { PageTracker } from "@/components/tracking/page-tracker"
import { demoSubjects, demoNotes, demoVideos } from "@/lib/demo-data"

export default function SubjectPage({ params }: { params: { slug: string } }) {
  const subject = demoSubjects.find((s) => s.slug === params.slug)
  const title = subject?.name || slugToTitle(params.slug)
  const notes = demoNotes.filter((n) => n.subjectId === subject?.id)
  const videos = demoVideos.filter((v) => v.subjectId === subject?.id)
  const pyqs = [
    {
      title: "Previous Year Paper (Sample 1)",
      url: "https://web.stanford.edu/class/archive/cs/cs106a/cs106a.1212/handouts_midterm/CS106A-Midterm.pdf",
    },
    {
      title: "Previous Year Paper (Sample 2)",
      url: "https://www.math.toronto.edu/ivan/mat185f10/MAT185F10Midterm.pdf",
    },
  ]

  return (
    <div className="space-y-6">
      <PageTracker title={title} href={`/subject/${params.slug}`} type="nav" />
      <header className="space-y-1">
        <h1 className="font-serif text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">Notes, PYQs, and videos for {title}.</p>
      </header>

      <section aria-labelledby="materials" className="space-y-3">
        <h2 id="materials" className="font-serif text-xl font-semibold">
          Materials
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.length > 0
            ? notes.map((n) => (
                <Link
                  key={n.id}
                  href={`/view/note?title=${encodeURIComponent(n.title)}&url=${encodeURIComponent(n.url)}`}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{n.title}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {n.type === "pdf" ? "PDF" : "Web"} • Opens inside site
                  </p>
                </Link>
              ))
            : [1, 2, 3].map((i) => (
                <article key={i} className="rounded-xl border border-border bg-card p-4 opacity-60">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">Chapter {i} Notes</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">PDF • Placeholder</p>
                </article>
              ))}
        </div>
      </section>

      <section aria-labelledby="pyqs" className="space-y-3">
        <h2 id="pyqs" className="font-serif text-xl font-semibold">
          PYQs
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pyqs.map((q) => (
            <a
              key={q.title}
              href={q.url}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-medium">{q.title}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">PDF • Opens in new tab</p>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="videos" className="space-y-3">
        <h2 id="videos" className="font-serif text-xl font-semibold">
          Videos
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {videos.length > 0
            ? videos.map((v) => (
                <Link
                  key={v.id}
                  href={`/view/video?v=${encodeURIComponent(v.url)}&title=${encodeURIComponent(v.title)}`}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{v.title}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">YouTube • Opens inside site</p>
                </Link>
              ))
            : [1, 2, 3].map((i) => (
                <article key={i} className="rounded-xl border border-border bg-card p-4 opacity-60">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">Lecture {i}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">YouTube • Placeholder</p>
                </article>
              ))}
        </div>
      </section>
    </div>
  )
}

function slugToTitle(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
}
