import { FileText, HelpCircle, PlayCircle } from "lucide-react"
import Link from "next/link" // use internal viewers
import { notFound } from "next/navigation"
import { PageTracker } from "@/components/tracking/page-tracker"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SubjectPage({ params }: { params: { slug: string } }) {
  const subject = await prisma.subject.findFirst({
    where: { slug: params.slug },
    include: { materials: true, pyqs: true, videos: true },
  })
  if (!subject) return notFound()

  const notes = subject.materials
  const pyqs = subject.pyqs
  const videos = subject.videos

  return (
    <div className="space-y-6">
      <PageTracker title={subject.name} href={`/subject/${subject.slug}`} type="nav" />
      <header className="space-y-1">
        <h1 className="font-serif text-2xl font-semibold">{subject.name}</h1>
        <p className="text-sm text-muted-foreground">Notes, PYQs, and videos for {subject.name}.</p>
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
                  href={`/view/note?title=${encodeURIComponent(n.title)}&url=${encodeURIComponent(
                    n.fileUrl || n.externalUrl || "",
                  )}`}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{n.title}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{n.type} • Opens inside site</p>
                </Link>
              ))
            : [1, 2, 3].map((i) => (
                <article key={i} className="rounded-xl border border-border bg-card p-4 opacity-60">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">Material {i}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Placeholder</p>
                </article>
              ))}
        </div>
      </section>

      <section aria-labelledby="pyqs" className="space-y-3">
        <h2 id="pyqs" className="font-serif text-xl font-semibold">
          PYQs
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pyqs.length > 0
            ? pyqs.map((q) => (
                <a
                  key={q.id}
                  href={q.fileUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{q.examType} {q.year}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">PDF • Opens in new tab</p>
                </a>
              ))
            : [1, 2, 3].map((i) => (
                <article key={i} className="rounded-xl border border-border bg-card p-4 opacity-60">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">PYQ {i}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Placeholder</p>
                </article>
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
                  href={`/view/video?v=${encodeURIComponent(
                    `https://www.youtube.com/watch?v=${v.youtubeId}`,
                  )}&title=${encodeURIComponent(v.title)}`}
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
                    <span className="text-sm font-medium">Video {i}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Placeholder</p>
                </article>
              ))}
        </div>
      </section>
    </div>
  )
}
