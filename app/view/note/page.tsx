import Link from "next/link"

export default function NoteViewerPage({
  searchParams,
}: {
  searchParams: { url?: string; title?: string }
}) {
  const url = searchParams?.url || ""
  const title = decodeURIComponent(searchParams?.title || "Note")
  const isPdf = url.toLowerCase().endsWith(".pdf")
  // Try direct embed; provide Google Viewer fallback if blocked
  const gview = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`
  const preferredSrc = isPdf ? url : url

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-xl font-semibold text-pretty">{title}</h1>
        <div className="flex items-center gap-2">
          <Link
            href={url || "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
          >
            Open original
          </Link>
          <Link
            href={gview}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
          >
            Google Viewer
          </Link>
        </div>
      </header>

      <div className="aspect-[4/5] w-full overflow-hidden rounded-lg border">
        {url ? (
          <iframe
            src={preferredSrc || gview}
            className="h-full w-full"
            title={title}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        ) : (
          <p className="p-4 text-sm text-muted-foreground">No URL provided.</p>
        )}
      </div>
    </div>
  )
}
