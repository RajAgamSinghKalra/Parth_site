import Link from "next/link"

function extractYouTubeId(input: string): string | null {
  try {
    const url = new URL(input)
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/")[1] || null
    }
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/watch")) return url.searchParams.get("v")
      if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] || null
      const shorts = url.pathname.startsWith("/shorts/") ? url.pathname.split("/")[2] : null
      if (shorts) return shorts
    }
  } catch {
    // maybe it's already an ID
    if (/^[\w-]{6,}$/.test(input)) return input
  }
  return null
}

export default function VideoViewerPage({
  searchParams,
}: {
  searchParams: { v?: string; title?: string }
}) {
  const raw = searchParams?.v || ""
  const title = decodeURIComponent(searchParams?.title || "Video")
  const id = extractYouTubeId(raw)
  const embed = id ? `https://www.youtube.com/embed/${id}` : null

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-xl font-semibold text-pretty">{title}</h1>
        {raw ? (
          <Link
            href={raw}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
          >
            Open on YouTube
          </Link>
        ) : null}
      </header>

      <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black">
        {embed ? (
          <iframe
            src={embed}
            className="h-full w-full"
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <p className="p-4 text-sm text-muted-foreground">Invalid or missing YouTube link.</p>
        )}
      </div>
    </div>
  )
}
