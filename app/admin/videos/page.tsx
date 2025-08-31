import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type VideoRow = {
  id: string
  subject: string
  title: string
  provider: "youtube" | "vimeo" | "other"
}

const demo: VideoRow[] = [
  { id: "1", subject: "Data Structures", title: "Stacks & Queues Crash Course", provider: "youtube" },
  { id: "2", subject: "Discrete Math", title: "Graph Theory Basics", provider: "youtube" },
]

export default function AdminVideosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Videos</h1>
          <p className="text-sm text-muted-foreground">Curate helpful lecture and explainer videos.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled title="CSV import coming soon">
            Import CSV
          </Button>
          <Button disabled title="Create coming soon">
            Add Video
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input placeholder="Search title or subject…" className="max-w-xs" />
        <Button variant="outline" disabled title="Filtering coming soon">
          Filter
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="grid grid-cols-12 border-b border-border/60 px-4 py-2 text-sm text-muted-foreground">
          <div className="col-span-6">Title</div>
          <div className="col-span-4">Subject</div>
          <div className="col-span-1">Provider</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <div>
          {demo.map((row) => (
            <div key={row.id} className="grid grid-cols-12 items-center px-4 py-3 border-b last:border-b-0">
              <div className="col-span-6 font-medium">{row.title}</div>
              <div className="col-span-4">{row.subject}</div>
              <div className="col-span-1 capitalize">{row.provider}</div>
              <div className="col-span-1 flex justify-end gap-2">
                <Button size="sm" variant="outline" disabled title="Edit coming soon">
                  Edit
                </Button>
                <Button size="sm" variant="destructive" disabled title="Delete coming soon">
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {demo.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No videos yet.</div>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Need PYQs?{" "}
        <Link className="underline underline-offset-4 hover:no-underline" href="/admin/pyqs">
          Go to PYQs
        </Link>
      </div>
    </div>
  )
}
